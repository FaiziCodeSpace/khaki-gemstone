import { useState, useEffect } from "react";
import adminApi from "../../services/adminServices/api.authService";
import { 
  Check, X, Trash2, MapPin, Phone, Mail, 
  Calendar, RefreshCw, Filter, User, 
  Search, AlertCircle, Clock, Info 
} from "lucide-react";

const IMG_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

const STATUS_BADGE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BargainerApplications() {
  const [bargainers, setBargainers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchBargainers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/bargainers?status=${filter}`);
      setBargainers(res.data.bargainers || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBargainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBargainers();
  }, [filter]);

  const handleApprove = async (id) => {
    if (!confirm("Approve this application?")) return;
    setActionLoading(id + "_approve");
    try {
      await adminApi.patch(`/bargainers/${id}/approve`);
      fetchBargainers();
    } catch (err) {
      alert("Failed to approve");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal._id + "_reject");
    try {
      await adminApi.patch(`/bargainers/${rejectModal._id}/reject`, {
        reason: rejectReason,
      });
      setRejectModal(null);
      setRejectReason("");
      fetchBargainers();
    } catch (err) {
      alert("Failed to reject");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await adminApi.delete(`/bargainers/${id}`);
      fetchBargainers();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Bargainer Applications</h2>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            <User size={14} className="text-emerald-600" /> Requests to use AgentHub portal
          </p>
        </div>
        <button
          onClick={fetchBargainers}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-sm font-bold bg-white border border-gray-200 rounded-2xl px-5 py-2.5 hover:bg-gray-50 text-gray-700 transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Responsive Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { key: "pending", label: "Pending", icon: <Clock size={14}/> },
          { key: "approved", label: "Approved", icon: <Check size={14}/> },
          { key: "rejected", label: "Rejected", icon: <X size={14}/> },
          { key: "", label: "All", icon: <Filter size={14}/> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border shrink-0 transition-all ${
              filter === key 
                ? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-200" 
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <RefreshCw size={32} className="text-emerald-500 animate-spin" />
          <p className="text-sm font-medium text-gray-400">Fetching applications...</p>
        </div>
      ) : bargainers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={24} className="text-gray-300" />
          </div>
          <p className="font-bold text-gray-800">No Applications Found</p>
          <p className="text-sm text-gray-400 mt-1">There are no records matching the "{filter || 'all'}" filter.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (shown only on small screens) */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {bargainers.map((b) => (
              <div key={b._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm">
                    {b.pfp ? (
                      <img src={`${IMG_BASE}/${b.pfp}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-black text-xl">
                        {b.fullName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-gray-900 truncate">{b.fullName}</h3>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                      <MapPin size={12} /> {b.city || "No City"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" /> {b.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                    <Mail size={14} className="text-gray-400" /> {b.email || "No email"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-gray-400" /> Joined {formatDate(b.createdAt)}
                  </div>
                  <div className={`mt-2 inline-flex px-3 py-1 rounded-xl text-[11px] font-black uppercase border ${STATUS_BADGE[b.status]}`}>
                    {b.status}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-50">
                  {b.status === "pending" && (
                    <>
                      <button 
                        onClick={() => handleApprove(b._id)}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => setRejectModal(b)}
                        className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(b._id)}
                    className="w-12 flex items-center justify-center text-gray-400 border border-gray-100 rounded-2xl active:bg-red-50 active:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden on small screens) */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Location / Contact</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applied On</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bargainers.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                            {b.pfp ? (
                              <img src={`${IMG_BASE}/${b.pfp}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">
                                {b.fullName?.[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{b.fullName}</div>
                            <div className="text-[10px] font-medium text-gray-400">ID: {b._id.slice(-8).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <MapPin size={12} className="text-emerald-500" /> {b.city || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">{b.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${STATUS_BADGE[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-600">{formatDate(b.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(b._id)}
                                disabled={actionLoading.includes(b._id)}
                                className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                                title="Approve"
                              >
                                <Check size={18} strokeWidth={3} />
                              </button>
                              <button
                                onClick={() => setRejectModal(b)}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                title="Reject"
                              >
                                <X size={18} strokeWidth={3} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Permanently"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h3 className="font-black text-gray-900 text-xl tracking-tight">Reject Application</h3>
              <p className="text-sm text-gray-500 mt-2">
                Provide a reason for rejecting <span className="font-bold text-gray-800">{rejectModal.fullName}</span>
              </p>
            </div>
            
            <textarea
              rows={3}
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Profile picture is not clear..."
              className="w-full border-2 border-gray-50 rounded-2xl px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:border-red-200 bg-gray-50/50 resize-none transition-all"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReject}
                disabled={actionLoading.includes(rejectModal._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl text-sm transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-red-200"
              >
                {actionLoading.includes(rejectModal._id) ? "Wait..." : "Reject Now"}
              </button>
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}