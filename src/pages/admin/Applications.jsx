import { useState, useEffect } from "react";
import { Search, User, MapPin, CreditCard, X, Phone, Mail, Calendar, Check, Ban, Loader2, Inbox } from "lucide-react";
import { fetchUsers, updateInvestorStatus } from "../../services/adminServices/applications";

export default function Applications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);
    const [investors, setInvestors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchUsers("investor");
            setInvestors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading investors:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            setIsActionLoading(true);
            await updateInvestorStatus(id, status);

            setInvestors(prevInvestors => 
                prevInvestors.map(inv => 
                    inv._id === id 
                        ? { ...inv, investor: { ...inv.investor, status: status } } 
                        : inv
                )
            );

            setSelectedApp(null);
        } catch (error) {
            console.error("Failed to update investor:", error);
            alert(`Error: Could not ${status} investor.`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredApps = investors.filter(app => {
        const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
        const cnic = app.investor?.cnic || "";
        return fullName.includes(searchTerm.toLowerCase()) || cnic.includes(searchTerm);
    });

    return (
        <section className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans">
            <div className="mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Investor Applications</h1>
                        <p className="text-sm text-slate-500">Manage and verify your investor database.</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CA0A7F] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search name or CNIC..."
                            className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#CA0A7F]/5 focus:border-[#CA0A7F] outline-none transition-all text-sm shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-[#CA0A7F]" size={28} />
                        <p className="text-xs font-medium text-slate-400 mt-4 tracking-wide">Syncing records...</p>
                    </div>
                ) : filteredApps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
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
                                    <StatusBadge status={app.investor?.status} />
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
                ) : (
                    /* No Applications Found / Empty State */
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                            <Inbox size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No applications found</h3>
                        <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
                            {searchTerm ? `We couldn't find any results for "${searchTerm}"` : "There are currently no investor applications to review."}
                        </p>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm("")}
                                className="mt-6 text-xs font-bold text-[#CA0A7F] hover:underline"
                            >
                                Clear search filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal remains the same */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-[2px]">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Application Profile</h2>
                            <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pt-4 space-y-8">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <DetailItem icon={<User size={14} />} label="Full Name" value={`${selectedApp.firstName} ${selectedApp.lastName}`} />
                                <DetailItem icon={<Mail size={14} />} label="Email Address" value={selectedApp.email} />
                                <DetailItem icon={<Phone size={14} />} label="Contact" value={selectedApp.investor?.phone} />
                                <DetailItem icon={<Calendar size={14} />} label="Date of Birth" value={selectedApp.investor?.dob ? new Date(selectedApp.investor.dob).toLocaleDateString() : "N/A"} />
                            </div>

                            <div className="bg-[#FBFBFC] p-5 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2 text-[#CA0A7F]">
                                    <MapPin size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Residency Details</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    {selectedApp.investor?.address || "Address not provided"}
                                </p>
                            </div>

                            {selectedApp.investor?.status === "pending" && (
                                <div className="flex gap-4 pt-2">
                                    <button
                                        disabled={isActionLoading}
                                        onClick={() => handleStatusUpdate(selectedApp._id, "decline")}
                                        className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Ban size={14} /> Decline
                                    </button>
                                    <button
                                        disabled={isActionLoading}
                                        onClick={() => handleStatusUpdate(selectedApp._id, "approve")}
                                        className="flex-1 py-3 text-xs font-bold bg-[#CA0A7F] text-white hover:bg-[#A80869] rounded-xl transition-all shadow-lg shadow-[#CA0A7F]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        {isActionLoading ? "Processing..." : "Approve Profile"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function StatusBadge({ status }) {
    const statusConfig = {
        approve: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Approved" },
        approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Approved" },
        decline: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Declined" },
        pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Pending Verification" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all duration-500 ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
}

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