import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, UserCheck, UserMinus, MoreVertical, Search,
  Plus, Phone, MapPin, Trash2, Edit, Globe, X, Loader2
} from 'lucide-react';

// --- SERVICES ---
import { fetchUsers } from '../../../services/adminServices/applications'; 
import { createAdmin, editAdmin } from '../../../services/adminServices/adminAuth';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New submission state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [formData, setFormData] = useState({ 
    _id: '', name: '', phone: '', city: '', password: '', confirmPassword: '' 
  });

  // --- API INTEGRATION ---
  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers('admin'); 
      if (response.success) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  // --- HANDLERS ---
  const handleSave = async () => {
    // Basic validation
    if (!formData.name || !formData.phone || !formData.city) {
      return alert("Please fill in all required fields.");
    }

    if (modalMode === 'create' && !formData.password) {
      return alert("Password is required for new accounts.");
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setIsSubmitting(true);
      
      if (modalMode === 'create') {
        const payload = {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          password: formData.password,
          role: 'ADMIN' // Explicitly setting role as per your controller
        };
        await createAdmin(payload);
      } else {
        // Your backend uses req.params.id for editing
        // We pass the ID and the body separately to the service
        const updateData = {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          ...(formData.password && { password: formData.password }) // Only send password if changed
        };
        await editAdmin(formData._id, updateData);
      }

      setIsModalOpen(false);
      loadAdmins(); // Refresh the list
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ _id: '', name: '', phone: '', city: '', password: '', confirmPassword: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setModalMode('edit');
    // Populate form with existing admin data
    setFormData({ 
      _id: admin._id, 
      name: admin.name, 
      phone: admin.phone, 
      city: admin.city, 
      password: '', 
      confirmPassword: '' 
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  // --- COMPUTED STATS ---
  const stats = useMemo(() => {
    const uniqueCities = [...new Set(admins.map(a => a.city || 'Unknown'))];
    return {
      total: admins.length,
      cities: uniqueCities.length,
      active: admins.filter(a => a.isActive !== false).length,
      inactive: admins.filter(a => a.isActive === false).length,
    };
  }, [admins]);

  const filteredAdmins = admins.filter(admin => 
    (admin.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (admin.phone?.includes(searchTerm))
  );

  return (
    <div className="space-y-6 bg-gray-50/50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 italic">Admin Roster</h1>
          <p className="text-xs md:text-sm text-gray-500">Manage internal team access and assignments.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-[#CA0A7F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#CA0A7F]/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span className="whitespace-nowrap">Create Admin</span>
        </button>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-0">
        <StatCard label="Total" value={stats.total} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Regions" value={stats.cities} icon={Globe} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Active" value={stats.active} icon={UserCheck} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Inactive" value={stats.inactive} icon={UserMinus} color="text-rose-600" bg="bg-rose-50" />
      </div>

      {/* --- SEARCH --- */}
      <div className="relative w-full px-4 md:px-0">
        <Search className="absolute left-7 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#CA0A7F]/20 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- DATA VIEW --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col mx-4 md:mx-0">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 py-20">
            <Loader2 className="animate-spin text-[#CA0A7F]" size={32} />
            <p className="text-sm font-medium">Syncing database...</p>
          </div>
        ) : filteredAdmins.length > 0 ? (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin._id} admin={admin} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEdit={() => openEditModal(admin)} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {filteredAdmins.map((admin) => (
                <MobileCard key={admin._id} admin={admin} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEdit={() => openEditModal(admin)} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Users size={32} className="text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold font-italic">No Admins Found</h3>
            <p className="text-gray-500 text-sm max-w-[250px] mt-1">We couldn't find any administrators matching your criteria.</p>
          </div>
        )}
      </div>

      {/* --- MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl z-[110] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{modalMode === 'create' ? 'Create Admin' : 'Edit Admin'}</h2>
              <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
                <X size={20}/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#CA0A7F]/10 disabled:opacity-50" 
                  placeholder="Enter name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                  <input 
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#CA0A7F]/10 disabled:opacity-50" 
                    placeholder="03xxxxxxxxx" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                  <input 
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#CA0A7F]/10 disabled:opacity-50" 
                    placeholder="City" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  {modalMode === 'create' ? 'Password' : 'New Password (Optional)'}
                </label>
                <input 
                  disabled={isSubmitting}
                  type="password" 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#CA0A7F]/10 disabled:opacity-50" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm Password</label>
                <input 
                  disabled={isSubmitting}
                  type="password" 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#CA0A7F]/10 disabled:opacity-50" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                />
              </div>
              <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#CA0A7F] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#CA0A7F]/20 mt-2 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS (StatCard, TableRow, MobileCard, StatusBadge, ActionMenu) ---

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-3 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
      <div className={`${bg} ${color} h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-lg md:rounded-xl shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">{label}</p>
        <p className="text-lg md:text-xl font-bold text-gray-900 leading-none mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function TableRow({ admin, activeMenu, setActiveMenu, onEdit }) {
  return (
    <tr className="hover:bg-gray-50/40 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-[#CA0A7F] font-bold text-sm group-hover:bg-[#CA0A7F] group-hover:text-white transition-colors">
            {admin.name?.charAt(0) || '?'}
          </div>
          <span className="text-sm font-semibold text-gray-900">{admin.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={14} className="text-gray-300" />
          {admin.phone}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-400" />
          {admin.city || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <StatusBadge active={admin.isActive} />
      </td>
      <td className="px-6 py-4 text-right relative">
        <ActionMenu id={admin._id} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEdit={onEdit} />
      </td>
    </tr>
  );
}

function MobileCard({ admin, activeMenu, setActiveMenu, onEdit }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#CA0A7F]/10 text-[#CA0A7F] flex items-center justify-center font-bold">
            {admin.name?.charAt(0) || '?'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{admin.name}</h3>
            <StatusBadge active={admin.isActive} />
          </div>
        </div>
        <ActionMenu id={admin._id} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEdit={onEdit} />
      </div>
      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone size={12} className="text-gray-400" />
          {admin.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <MapPin size={12} className="text-gray-400" />
          {admin.city || 'N/A'}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active }) {
  const status = active !== false; 
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
      status ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400 border border-gray-100'
    }`}>
      {status ? 'Active' : 'Inactive'}
    </span>
  );
}

function ActionMenu({ id, activeMenu, setActiveMenu, onEdit }) {
  const isOpen = activeMenu === id;
  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setActiveMenu(isOpen ? null : id);
        }}
        className="p-2 text-gray-400 hover:text-[#CA0A7F] hover:bg-gray-50 rounded-lg transition-all"
      >
        <MoreVertical size={20} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
            <button 
              onClick={onEdit}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit size={16} className="text-blue-500" /> Edit Admin
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={16} /> Delete Admin
            </button>
          </div>
        </>
      )}
    </div>
  );
}