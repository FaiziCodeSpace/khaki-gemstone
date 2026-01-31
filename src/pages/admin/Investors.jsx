import { useCallback, useEffect, useState, useMemo } from "react";
import {
    Search, Users, UserCheck, Wallet, Gem,
    Eye, ArrowUpRight, X, MapPin, Phone, CreditCard, Hash,
    TrendingUp, CircleDollarSign, Mail, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";
import { fetchDashboardMetrics } from "../../services/adminServices/dashboardMatricsService";
import { fetchUsers } from "../../services/adminServices/applications";

export default function InvestorManagement() {
    // --- State Management ---
    const [investors, setInvestors] = useState([]);
    const [investorData, setInvestorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [isRefetching, setIsRefetching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Pagination (Backend-driven)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const [selectedInvestor, setSelectedInvestor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Data Fetching ---
    const loadData = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setIsLoading(true);
            else setIsRefetching(true);

            /** * Modified: Passing 'approved' status explicitly. 
             * This ensures the list only contains verified investors.
             */
            const [metrics, usersResponse] = await Promise.all([
                fetchDashboardMetrics(),
                fetchUsers("investor", "approved", currentPage, itemsPerPage)
            ]);

            if (metrics) setInvestorData(metrics);

            // Extract from paginated structure: { data: [], totalPages: X }
            const rawUsers = usersResponse?.data || [];
            setTotalPages(usersResponse?.totalPages || 1);

            const mappedUsers = rawUsers.map(user => ({
                mongoId: user._id,
                firstName: user.firstName || "Unknown",
                lastName: user.lastName || "",
                email: user.email,
                status: user.isActive ? "Active" : "Blocked",
                joinDate: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })
                    : "N/A",
                id: user.investor?.investorId || "N/A",
                balance: user.investor?.balance ?? 0,
                totalInvestment: user.investor?.totalInvestment ?? 0,
                totalEarnings: user.investor?.totalEarnings ?? 0,
                phone: user.investor?.phone || "N/A",
                cnic: user.investor?.cnic || "N/A",
                city: user.investor?.city || "N/A",
                address: user.investor?.address || "N/A",
                productsCount: user.investor?.productsInvested?.length || 0,
                products: (user.investor?.productsInvested || []).map(p => ({
                    productId: p.product?._id || "N/A",
                    name: p.product?.name || "Gemstone Asset",
                    amount: p.amountInvested || 0
                }))
            }));

            setInvestors(mappedUsers);
        } catch (err) {
            console.error("Initialization failed:", err);
        } finally {
            setIsLoading(false);
            setIsRefetching(false);
        }
    }, [currentPage]);

    // Effect: Initial Load & Page Change
    useEffect(() => {
        loadData(true);
    }, [loadData]);

    // Effect: 60-Second Auto-Sync
    useEffect(() => {
        const interval = setInterval(() => {
            loadData(false);
        }, 60000); 
        return () => clearInterval(interval);
    }, [loadData]);

    // Local filter for the current page
    const filteredInvestors = useMemo(() => {
        return investors.filter(inv =>
            `${inv.firstName} ${inv.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, investors]);

    const stats = [
        { label: "Active Investors", value: isLoading ? "..." : (investorData?.activeInvestors || 0), icon: <UserCheck size={18} />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { label: "Total Investors", value: isLoading ? "..." : (investorData?.totalInvestors || 0), icon: <Users size={18} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
        { label: "Total Investment", value: isLoading ? "..." : `Rs. ${investorData?.totalInvestments?.toLocaleString() || 0}`, icon: <Wallet size={18} />, color: "bg-pink-50 text-[#CA0A7F] border-pink-100" },
        { label: "Products Invested", value: isLoading ? "..." : (investorData?.productsInvested || 0), icon: <Gem size={18} />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    ];

    return (
        <div className="space-y-8 bg-[#FAFBFC] min-h-screen font-jakarta p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Verified Portfolios</h2>
                        {isRefetching && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-pink-50 rounded-lg">
                                <RefreshCw size={14} className="text-[#CA0A7F] animate-spin" />
                                <span className="text-[10px] font-bold text-[#CA0A7F] uppercase tracking-tighter">Syncing</span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-500">Managing active investor assets and equity.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                    <ArrowUpRight size={16} />
                    <span>Generate Report</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-[#CA0A7F]/30 transition-all duration-300">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl border ${stat.color} group-hover:rotate-6 transition-transform`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full text-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ID or name..."
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl outline-none"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                                <th className="px-8 py-5">Investor Identity</th>
                                <th className="px-6 py-5">Portfolio Strength</th>
                                <th className="px-6 py-5 text-gray-900">Total Capital</th>
                                <th className="px-6 py-5">Account Status</th>
                                <th className="px-8 py-5 text-right font-black">Engagement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-gray-400 text-sm italic tracking-widest uppercase font-bold animate-pulse">Initializing Data Stream...</p>
                                    </td>
                                </tr>
                            ) : filteredInvestors.length > 0 ? (
                                filteredInvestors.map((inv) => (
                                    <tr key={inv.mongoId} className="hover:bg-gray-50/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs border border-gray-200">
                                                    {inv.firstName[0]}{inv.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 mb-1">{inv.firstName} {inv.lastName}</p>
                                                    <span className="text-[9px] text-gray-400 font-mono tracking-tight uppercase px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{inv.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-xs font-bold text-gray-700">{inv.productsCount} Assets</span></td>
                                        <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tight">Rs. {inv.totalInvestment.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${inv.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button
                                                onClick={() => { setSelectedInvestor(inv); setIsModalOpen(true); }}
                                                className="flex items-center gap-2 bg-white hover:bg-gray-900 text-gray-700 hover:text-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                                            >
                                                <Eye size={14} className="text-[#CA0A7F]" /> Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-sm font-bold text-gray-400">No approved investors found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50 border-t border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-2 border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-2 border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {isModalOpen && selectedInvestor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div className="flex gap-5 items-center">
                                <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-200 flex items-center justify-center text-3xl font-black text-gray-800">
                                    {selectedInvestor.firstName[0]}{selectedInvestor.lastName[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedInvestor.firstName} {selectedInvestor.lastName}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono font-bold text-[#CA0A7F] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100 uppercase">{selectedInvestor.id}</span>
                                        <span className="text-[11px] font-medium text-gray-400">Verified {selectedInvestor.joinDate}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-2xl transition-all"><X size={20} /></button>
                        </div>

                        <div className="px-8 grid grid-cols-3 gap-3">
                            <FinancialCard label="Total Investment" value={selectedInvestor.totalInvestment} color="text-gray-900" icon={<Wallet size={12} />} />
                            <FinancialCard label="Total Earnings" value={selectedInvestor.totalEarnings} color="text-emerald-600" icon={<TrendingUp size={12} />} />
                            <FinancialCard label="Balance" value={selectedInvestor.balance} color="text-[#CA0A7F]" icon={<CircleDollarSign size={12} />} />
                        </div>

                        <div className="p-8 space-y-8 max-h-[50vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-y-6">
                                <InfoItem icon={<Mail size={14} />} label="Email" value={selectedInvestor.email} />
                                <InfoItem icon={<Phone size={14} />} label="Contact" value={selectedInvestor.phone} />
                                <InfoItem icon={<CreditCard size={14} />} label="CNIC" value={selectedInvestor.cnic} />
                                <InfoItem icon={<MapPin size={14} />} label="City" value={selectedInvestor.city} />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Portfolio Breakdown</h4>
                                <div className="grid gap-3">
                                    {selectedInvestor.products?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-[#CA0A7F]"><Gem size={14} /></div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-[9px] font-mono text-gray-400 uppercase">UID: {item.productId}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-gray-900">Rs. {item.amount.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Components
function FinancialCard({ label, value, color, icon }) {
    return (
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400">{icon}</span>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
            <p className={`text-xs font-black ${color}`}>Rs. {value.toLocaleString()}</p>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#CA0A7F]/60">
                {icon}
                <span className="text-[9px] font-bold text-gray-400 uppercase">{label}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{value || "—"}</p>
        </div>
    );
}