import { useState, useEffect, useMemo } from "react";
import { Search, User, MapPin, CreditCard, X, Phone, Mail, Calendar, Check, Ban, Loader2, Inbox, Clock } from "lucide-react";
import { fetchUsers, updateInvestorStatus } from "../../services/adminServices/applications";

export default function Applications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);
    const [investors, setInvestors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- Data Loading ---
    const loadData = async (currentPage = 1) => {
        try {
            setIsLoading(true);
            /** * Modified: Explicitly passing "investor" role and "pending" status 
             * to the API service we refactored earlier.
             */
            const response = await fetchUsers("investor", "pending", currentPage, 12);
            
            // Backend returns { success: true, data: [...], totalPages: X }
            setInvestors(response.data || []);
            setTotalPages(response.totalPages || 1);
        } catch (err) {
            console.error("Fetch Error:", err);
            // In production, trigger a toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData(page);
    }, [page]);

    // --- Actions ---
    const handleStatusUpdate = async (id, status) => {
        const actionText = status === 'approve' ? 'approve' : 'decline';
        if (!window.confirm(`Are you sure you want to ${actionText} this application?`)) return;

        try {
            setIsActionLoading(true);
            await updateInvestorStatus(id, status);

            // Since this view is ONLY for pending users, 
            // once updated, the user should be removed from this list.
            setInvestors(prev => prev.filter(inv => inv._id !== id));
            setSelectedApp(null);
            
            // If the current page becomes empty and we aren't on page 1, go back a page
            if (investors.length === 1 && page > 1) {
                setPage(prev => prev - 1);
            }
        } catch (error) {
            alert(error.message || "Action failed. Please try again.");
        } finally {
            setIsActionLoading(false);
        }
    };

    // --- Search (Local filter on the fetched pending set) ---
    const filteredApps = useMemo(() => {
        if (!searchTerm) return investors;
        const s = searchTerm.toLowerCase();
        return investors.filter(app => 
            `${app.firstName} ${app.lastName}`.toLowerCase().includes(s) || 
            (app.investor?.cnic || "").includes(s)
        );
    }, [searchTerm, investors]);

    return (
        <section className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#CA0A7F]">
                            <Clock size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Verification Queue</span>
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Pending Investors</h1>
                        <p className="text-sm text-slate-500">Review new applications for platform access.</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CA0A7F] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search pending applications..."
                            className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#CA0A7F]/5 focus:border-[#CA0A7F] outline-none transition-all text-sm shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-[#CA0A7F]" size={28} />
                        <p className="text-xs font-medium text-slate-400 mt-4 tracking-wide">Loading queue...</p>
                    </div>
                ) : filteredApps.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {filteredApps.map((app) => (
                                <div
                                    key={app._id}
                                    onClick={() => setSelectedApp(app)}
                                    className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#CA0A7F]/30 transition-all cursor-pointer relative"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-[#CA0A7F]/5 text-[#CA0A7F] rounded-xl flex items-center justify-center text-sm font-bold border border-[#CA0A7F]/10">
                                            {app.firstName?.[0]}{app.lastName?.[0]}
                                        </div>
                                        <div className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase rounded-lg">
                                            Pending
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 group-hover:text-[#CA0A7F] transition-colors">
                                            {app.firstName} {app.lastName}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">{app.email}</p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <CreditCard size={14} />
                                            <span className="text-[11px] font-bold text-slate-600 truncate">{app.investor?.cnic || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin size={14} />
                                            <span className="text-[11px] font-bold text-slate-600 truncate">{app.investor?.city || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                                <button 
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 border rounded-lg bg-white disabled:opacity-30 hover:bg-slate-50"
                                >
                                    Prev
                                </button>
                                <span className="text-sm font-medium px-4">Page {page} of {totalPages}</span>
                                <button 
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 border rounded-lg bg-white disabled:opacity-30 hover:bg-slate-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                            <Inbox size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
                        <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
                            No pending investor applications found at the moment.
                        </p>
                    </div>
                )}
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Review Application</h2>
                            <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pt-4 space-y-8">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <DetailItem icon={<User size={14} />} label="Full Name" value={`${selectedApp.firstName} ${selectedApp.lastName}`} />
                                <DetailItem icon={<Mail size={14} />} label="Email Address" value={selectedApp.email} />
                                <DetailItem icon={<Phone size={14} />} label="Contact" value={selectedApp.investor?.phone} />
                                <DetailItem icon={<Calendar size={14} />} label="DOB" value={selectedApp.investor?.dob ? new Date(selectedApp.investor.dob).toLocaleDateString() : "N/A"} />
                            </div>

                            <div className="bg-[#FBFBFC] p-6 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2 text-[#CA0A7F]">
                                    <MapPin size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Residency</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">{selectedApp.investor?.address || "No address provided"}</p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    disabled={isActionLoading}
                                    onClick={() => handleStatusUpdate(selectedApp._id, "decline")}
                                    className="flex-1 py-4 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Ban size={14} /> Decline
                                </button>
                                <button
                                    disabled={isActionLoading}
                                    onClick={() => handleStatusUpdate(selectedApp._id, "approve")}
                                    className="flex-1 py-4 text-xs font-bold bg-[#CA0A7F] text-white hover:bg-[#A80869] rounded-2xl transition-all shadow-lg shadow-[#CA0A7F]/25 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    Approve Investor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

// Sub-components
function DetailItem({ icon, label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                <span className="text-[#CA0A7F]">{icon}</span> {label}
            </p>
            <p className="text-sm font-semibold text-slate-800 truncate">{value || "—"}</p>
        </div>
    );
}