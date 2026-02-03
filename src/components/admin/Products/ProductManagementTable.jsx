import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, 
    MapPin, Eye, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { fetchAllProducts, deleteProduct } from "../../../services/productsService";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState({
        totalProducts: 0,
        totalPages: 1
    });
    const itemsPerPage = 10;

    // 1. Fetch live data from backend with pagination
    const loadProducts = async () => {
        setIsLoading(true);
        try {
            // Passing search, limit, and page to the service
            const data = await fetchAllProducts({ 
                search: searchTerm,
                limit: itemsPerPage,
                page: currentPage 
            });

            setProducts(data);
            
            // Accessing the metadata we attached in the service
            if (data.pagination) {
                setPaginationInfo({
                    totalProducts: data.pagination.totalProducts,
                    totalPages: data.pagination.totalPages
                });
            }
        } catch (err) {
            console.error("Failed to load inventory:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch when search changes (Reset to page 1 on new search)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                loadProducts();
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Refetch when page changes
    useEffect(() => {
        loadProducts();
    }, [currentPage]);

    // 2. Delete Action
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteProduct(id);
                // Refresh current page after delete
                loadProducts();
            } catch (err) {
                alert("Action failed: " + err.message);
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Product Inventory</h2>
                    <p className="text-sm text-gray-500 font-jakarta">Live vault from MongoDB.</p>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by ID, Name, or Tags..."
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
                                <th className="px-6 py-4 font-semibold w-24">Asset</th>
                                <th className="px-6 py-4 font-semibold">Gemstone Details</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-[#CA0A7F]">Profit Margin</th>
                                <th className="px-6 py-4 font-semibold">Visibility</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-[#CA0A7F]" />
                                        Syncing with Vault...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-400">No products found.</td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                            {product.imgs_src?.[0] ? (
                                                <img 
                                                    src={`${API_URL}${product.imgs_src[0]}`} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Eye size={16}/></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono uppercase">{product.productNumber}</span>
                                                <span className="text-[10px] text-[#CA0A7F] font-semibold">{product.gem_size} mm</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <MapPin size={14} className="text-gray-400" />
                                            {product?.location || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        Rs. {product.price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.portal === "INVESTOR" ? (
                                            <span className="text-sm font-bold text-[#CA0A7F]">
                                                {product.profitMargin}%
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                                DIRECT SALE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                            product.portal === "PUBLIC"
                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                            : "bg-purple-50 text-purple-600 border-purple-100"
                                        }`}>
                                            {product.portal}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/products/formbox/${product._id}`}>
                                                <button className="p-2 text-gray-400 hover:text-[#CA0A7F] hover:bg-pink-50 rounded-lg"><Edit2 size={16}/></button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER --- */}
                <div className="bg-white border-t border-gray-50 px-6 py-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing page {currentPage} of {paginationInfo.totalPages} ({paginationInfo.totalProducts} total items)
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <span className="text-sm font-semibold px-2 text-gray-700">
                            {currentPage}
                        </span>

                        <button 
                            disabled={currentPage >= paginationInfo.totalPages || isLoading}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}