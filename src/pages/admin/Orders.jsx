import { useState } from "react";
import {
    Search, Package, Truck, Users, BanknoteArrowUp,
    Eye, Trash2, ChevronLeft, ChevronRight, MapPin, ArrowUpRight
} from "lucide-react";

// Mock data expanded to demonstrate pagination
const ALL_ORDERS = Array.from({ length: 25 }, (_, i) => ({
    id: (7721 + i).toString(),
    customer: i % 2 === 0 ? "Zahid Khan" : "Sana Malik",
    location: i % 3 === 0 ? "Peshawar" : "Skardu",
    product: `GEM-${323 + i}`,
    total: `Rs. ${45000 + (i * 1000)}`,
    status: ["New", "On Way", "Delivered", "Cancelled"][i % 4],
    date: "24 Jan 2026"
}));

export default function OrderManagement() {
    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculation for slicing data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = ALL_ORDERS.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ALL_ORDERS.length / itemsPerPage);

    const stats = [
        { label: "New", value: "12", icon: <Package size={18} />, color: "bg-blue-50 text-blue-600" },
        { label: "On Way", value: "08", icon: <Truck size={18} />, color: "bg-orange-50 text-orange-600" },
        { label: "Revenue", value: "4.2M", icon: <BanknoteArrowUp size={18} />, color: "bg-[#CA0A7F]/10 text-[#CA0A7F]" },
        { label: "Users", value: "892", icon: <Users size={18} />, color: "bg-gray-100 text-gray-600" },
    ];

    return (
        <div className="max-w-7xl mx-auto md:p-0 space-y-6 font-jakarta">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-0">
                <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Order Management</h2>
                    <p className="text-sm text-gray-500">Logistics & fulfillment dashboard.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md text-sm">
                    <ArrowUpRight size={18} />
                    <span>Export Analytics</span>
                </button>
            </div>

            {/* --- STATS --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-0">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
                        <div className={`p-2.5 md:p-3 rounded-xl ${stat.color} shrink-0`}>{stat.icon}</div>
                        <div className="min-w-0">
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{stat.label}</p>
                            <h3 className="text-base md:text-lg font-black text-gray-900 truncate">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SEARCH --- */}
            <div className="px-4 md:px-0">
                <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search order ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#CA0A7F]/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* --- TABLE & MOBILE CARDS --- */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mx-4 md:mx-0">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Order ID & Date</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold text-[#CA0A7F]">Product</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900">#ORD-{order.id}</p>
                                        <p className="text-[10px] text-gray-400 font-mono">{order.date}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-700">{order.customer}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <MapPin size={12} /> {order.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-[#CA0A7F] bg-pink-50 px-2 py-1 rounded-lg">{order.product}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900">{order.total}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4">
                                        <ActionButtons status={order.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {currentOrders.map((order) => (
                        <div key={order.id} className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-mono text-gray-400 uppercase tracking-tighter">#ORD-{order.id} • {order.date}</p>
                                    <h4 className="font-bold text-gray-900">{order.customer}</h4>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                            <div className="flex gap-2">
                                <ActionButtons status={order.status} isMobile />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- PAGINATION FOOTER --- */}
                <div className="bg-gray-50/30 px-6 py-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, ALL_ORDERS.length)} of {ALL_ORDERS.length}
                    </p>
                    
                    <div className="flex items-center gap-2">
                        {/* Prev Button */}
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 border border-gray-200 rounded-lg bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                                        currentPage === pageNum 
                                        ? "bg-gray-900 text-white border-gray-900" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 border border-gray-200 rounded-lg bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function StatusBadge({ status }) {
    const styles = {
        "New": "bg-blue-50 text-blue-600 border-blue-100",
        "On Way": "bg-orange-50 text-orange-600 border-orange-100",
        "Delivered": "bg-emerald-50 text-emerald-600 border-emerald-100",
        "Cancelled": "bg-red-50 text-red-400 border-red-100",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status]}`}>
            {status === "New" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
            {status}
        </span>
    );
}

function ActionButtons({ status, isMobile = false }) {
    return (
        <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : 'justify-end'}`}>
            <button className={`${isMobile ? 'flex-1' : ''} p-2 flex items-center justify-center gap-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all`}>
                <Eye size={18} />
                {isMobile && <span className="text-xs font-bold">View</span>}
            </button>
            <button
                disabled={status !== "New"}
                className={`${isMobile ? 'flex-[2]' : ''} p-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold uppercase text-[10px] tracking-tight
                    ${status === "New" 
                        ? "bg-[#CA0A7F] text-white border border-[#CA0A7F] shadow-sm shadow-[#CA0A7F]/20" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100"}`}
            >
                <Truck size={16} />
                <span>{status === "New" ? "Dispatch" : "Shipped"}</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={18} />
            </button>
        </div>
    );
}