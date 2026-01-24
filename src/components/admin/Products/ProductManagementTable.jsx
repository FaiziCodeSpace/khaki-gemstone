import { useState } from "react";
import { Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, Filter,
    MapPin, Eye, ChevronLeft, ChevronRight
} from "lucide-react";

const ALL_PRODUCTS = [
    { id: "GEM-9921", name: "Blue Sapphire (Neelam)", location: "Dera Ismail Khan", price: "Rs. 125,000", margin: "25%", status: "In Public", gem_size: "8.2 Carats" },
    { id: "GEM-4412", name: "Raw Emerald (Panna)", location: "Peshawar", price: "Rs. 85,000", margin: "30%", status: "In Investor Portal", gem_size: "12 Carats" },
    { id: "GEM-1022", name: "Red Ruby (Yaqoot)", location: "Gilgit", price: "Rs. 210,000", status: "In Public", gem_size: "5.4 Carats" },
    { id: "GEM-3391", name: "Yellow Topaz", location: "Katlang", price: "Rs. 45,000", margin: "25%", status: "In Investor Portal", gem_size: "15.0 Carats" },
    { id: "GEM-5520", name: "Tourmaline", location: "Stak Nala", price: "Rs. 62,000", margin: "25%", status: "In Public", gem_size: "9.1 Carats" },
    { id: "GEM-8812", name: "Aquamarine", location: "Skardu", price: "Rs. 150,000", margin: "35%", status: "In Investor Portal", gem_size: "22.5 Carats" },
    { id: "GEM-2290", name: "Peridot", location: "Spat Valley", price: "Rs. 35,000", margin: "20%", status: "In Public", gem_size: "4.2 Carats" },
    { id: "GEM-7731", name: "Kunzit", location: "Chitral", price: "Rs. 28,000", margin: "25%", status: "In Public", gem_size: "18.0 Carats" },
    { id: "GEM-4401", name: "Spinel", location: "Hunza", price: "Rs. 95,000", margin: "30%", status: "In Investor Portal", gem_size: "6.8 Carats" },
    { id: "GEM-6619", name: "Quartz", location: "Balochistan", price: "Rs. 12,000", status: "In Public", gem_size: "45.0 Carats" },
    { id: "GEM-1122", name: "Pink Topaz", location: "Katlang", price: "Rs. 300,000", margin: "40%", status: "In Investor Portal", gem_size: "3.2 Carats" },
    { id: "GEM-9933", name: "Zircon", location: "Dera Ismail Khan", price: "Rs. 18,000", margin: "20%", status: "In Public", gem_size: "10.5 Carats" }
];

export default function ProductTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Pagination Logic
    const totalPages = Math.ceil(ALL_PRODUCTS.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = ALL_PRODUCTS.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="space-y-4">
            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Product Inventory</h2>
                    <p className="text-sm text-gray-500 font-jakarta">Manage gemstone details and portal visibility.</p>
                </div>

                <Link to="/admin/products/formbox">
                    <button className="flex items-center justify-center gap-2 bg-[#CA0A7F] hover:bg-[#b0086e] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-[#CA0A7F]/20 text-sm">
                        <Plus size={18} />
                        <span>Add New Gemstone</span>
                    </button>
                </Link>
            </div>

            {/* --- SEARCH --- */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#CA0A7F]/20 focus:border-[#CA0A7F] transition-all"
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Gemstone Details</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-[#CA0A7F]">Investor Margin</th>
                                <th className="px-6 py-4 font-semibold">Visibility</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono uppercase">{product.id}</span>
                                                <span className="text-[10px] text-[#CA0A7F] font-semibold">{product.gem_size}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <MapPin size={14} className="text-gray-400" />
                                            {product.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.price}</td>
                                    <td className="px-6 py-4">
                                        {product.status === "In Public" && !product.margin ? (
                                            <span className="text-[10px] font-bold text-green-400 bg-green-50 px-2 py-1 rounded-md border border-green-100 uppercase tracking-tight">
                                                Direct Sale
                                            </span>
                                        ) : (
                                            <span className="text-sm font-bold text-[#CA0A7F]">
                                                {product.margin}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${product.status === "In Public"
                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                            : "bg-purple-50 text-purple-600 border-purple-100"
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><Eye size={16} /></button>
                                            <Link to={`/admin/products/formbox/${product.id}`}>
                                                <button className="p-2 text-gray-400 hover:text-[#CA0A7F] hover:bg-pink-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                            </Link>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION FOOTER --- */}
                <div className="bg-white border-t border-gray-50 px-6 py-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium font-jakarta">
                        Showing <span className="text-gray-900">{indexOfFirstItem + 1}</span> to <span className="text-gray-900">{Math.min(indexOfLastItem, ALL_PRODUCTS.length)}</span> of <span className="text-gray-900">{ALL_PRODUCTS.length}</span> gemstones
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${currentPage === i + 1
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}