import { useState } from "react";
import {
    Search, Users, UserCheck, Wallet, Gem,
    Eye, ShieldOff, ShieldCheck, ChevronLeft,
    ChevronRight, ArrowUpRight, Filter
} from "lucide-react";

const INITIAL_INVESTORS = [
    { id: "INV-2021", firstName: "Arsalan", lastName: "Ahmed", productsCount: 4, totalInvested: "Rs. 1,250,000", status: "Active", joinDate: "12 Dec 2025" },
    { id: "INV-3042", firstName: "Sara", lastName: "Khan", productsCount: 1, totalInvested: "Rs. 85,000", status: "Active", joinDate: "05 Jan 2026" },
    { id: "INV-1102", firstName: "Zohaib", lastName: "Malik", productsCount: 12, totalInvested: "Rs. 4,800,000", status: "Active", joinDate: "18 Nov 2025" },
    { id: "INV-9931", firstName: "Umer", lastName: "Farooq", productsCount: 0, totalInvested: "Rs. 0", status: "Blocked", joinDate: "22 Jan 2026" },
    { id: "INV-5520", firstName: "Ayesha", lastName: "Rayyub", productsCount: 3, totalInvested: "Rs. 620,000", status: "Active", joinDate: "30 Dec 2025" },
    { id: "INV-6610", firstName: "Bilal", lastName: "Shah", productsCount: 2, totalInvested: "Rs. 300,000", status: "Active", joinDate: "10 Jan 2026" },
];

export default function InvestmentManagement() {
    const [investors, setInvestors] = useState(INITIAL_INVESTORS);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    // Pagination Logic
    const totalPages = Math.ceil(investors.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInvestors = investors.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Toggle Status Logic
    const toggleStatus = (id) => {
        setInvestors(prev => prev.map(inv => 
            inv.id === id 
                ? { ...inv, status: inv.status === "Active" ? "Blocked" : "Active" } 
                : inv
        ));
    };

    const stats = [
        { label: "Active Investors", value: "412", icon: <UserCheck size={18} />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { label: "Total Investors", value: "528", icon: <Users size={18} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
        { label: "Total Investment", value: "₨ 18.4M", icon: <Wallet size={18} />, color: "bg-pink-50 text-[#CA0A7F] border-pink-100" },
        { label: "Products Invested", value: "84", icon: <Gem size={18} />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    ];

    return (
        <div className="space-y-8 bg-[#FAFBFC] min-h-screen font-jakarta">
            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Investment Portfolios</h2>
                    <p className="text-sm font-medium text-gray-500">Analytics and asset allocation for high-net-worth accounts.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                    <ArrowUpRight size={16} />
                    <span>Generate Report</span>
                </button>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-start justify-between group hover:border-[#CA0A7F]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl border ${stat.color} group-hover:rotate-6 transition-transform duration-300`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- FILTER BAR --- */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, name or capital..."
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-sm focus:outline-none placeholder:text-gray-400"
                    />
                </div>
                <div className="h-8 w-px bg-gray-100 hidden md:block"></div>
                <div className="flex items-center gap-2 w-full md:w-auto p-1">
                    <Filter size={14} className="text-gray-400 ml-2 hidden md:block" />
                    <select className="w-full md:w-44 bg-transparent border-none rounded-xl px-2 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 outline-none cursor-pointer hover:bg-gray-50 transition-colors">
                        <option>All Investors</option>
                        <option>Status: Active</option>
                        <option>Status: Blocked</option>
                    </select>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
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
                            {currentInvestors.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs border border-gray-200 shadow-sm">
                                                {inv.firstName[0]}{inv.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{inv.firstName} {inv.lastName}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-gray-400 font-mono tracking-tight uppercase px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{inv.id}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">Joined {inv.joinDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(inv.productsCount, 3))].map((_, i) => (
                                                    <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
                                                        <div className="w-full h-full rounded-full bg-pink-50 flex items-center justify-center">
                                                            <Gem size={10} className="text-[#CA0A7F]" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">
                                                {inv.productsCount} Assets
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tight">
                                        {inv.totalInvested}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                            inv.status === "Active"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-red-50 text-red-500 border-red-100"
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {/* --- THE FIXED PROFILE BUTTON --- */}
                                            <button className="flex items-center gap-2 bg-white hover:bg-gray-900 text-gray-700 hover:text-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:shadow-lg active:scale-95 [&:hover_svg]:text-white">
                                                <Eye size={14} className="text-[#CA0A7F] transition-colors duration-200" />
                                                Profile
                                            </button>

                                            <button
                                                onClick={() => toggleStatus(inv.id)}
                                                title={inv.status === "Active" ? "Block Access" : "Unblock Access"}
                                                className={`p-2.5 rounded-xl transition-all border shadow-sm ${
                                                    inv.status === "Active"
                                                        ? "text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100"
                                                        : "text-red-500 bg-red-50 border-red-100 hover:bg-red-100"
                                                }`}
                                            >
                                                {inv.status === "Active" ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER / PAGINATION --- */}
                <div className="bg-gray-50/30 border-t border-gray-100 px-8 py-5 flex items-center justify-between">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                        Records <span className="text-gray-900">{indexOfFirstItem + 1}—{Math.min(indexOfLastItem, investors.length)}</span> of {investors.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 border border-gray-200 rounded-xl bg-white transition-all shadow-sm ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 hover:border-gray-300 active:scale-90"}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <div className="flex items-center gap-1 mx-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-8 h-8 text-[11px] font-black rounded-lg transition-all ${
                                        currentPage === i + 1 
                                        ? "bg-gray-900 text-white shadow-md shadow-gray-200 scale-110" 
                                        : "bg-transparent text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 border border-gray-200 rounded-xl bg-white transition-all shadow-sm ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 hover:border-gray-300 active:scale-90"}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}