import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, 
    MapPin, Eye, ChevronLeft, ChevronRight, Loader2,
    TrendingUp, Wallet, Landmark
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

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAllProducts({ 
                search: searchTerm, 
                limit: itemsPerPage, 
                page: currentPage 
            });

            setProducts(data);
            
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

    useEffect(() => {
        loadProducts();
    }, [currentPage]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (err) {
                alert("Action failed: " + err.message);
            }
        }
    };

    // --- FINANCIAL CALCULATIONS (FIXED ADMIN RECOVERY) ---
    const calculateFinancials = (product) => {
        const basePrice = product.price || 0;
        const marginPercent = product.profitMargin || 0;
        const profitSharing = product.profitSharingModel || 0; 

        // 1. Calculate the Markup (The Profit)
        const totalProfitMarkup = basePrice * (marginPercent / 100);
        
        // 2. Total List Price (Base + Profit)
        const totalListPrice = basePrice + totalProfitMarkup;

        // 3. Investor Share (Split % of the Profit only)
        const investorShare = totalProfitMarkup * (profitSharing / 100);

        // 4. Admin Recovery (Total Price - Investor Share)
        // If Total is 4 and Investor gets 1, Admin gets 3
        const adminRecovery = totalListPrice - investorShare;
        
        return {
            totalListPrice: totalListPrice,
            investorShare: investorShare,
            adminRecovery: adminRecovery,
            split: profitSharing,
            margin: marginPercent
        };
    };

    const getPortalStyle = (portal) => {
        switch (portal) {
            case "PUBLIC": return "bg-blue-50 text-blue-600 border-blue-100";
            case "INVESTOR": return "bg-purple-50 text-purple-600 border-purple-100";
            case "PUBLIC BY INVESTED": return "bg-amber-50 text-amber-600 border-amber-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div className="space-y-4 font-jakarta">
            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Vault Inventory</h2>
                    <p className="text-sm text-gray-500">Manage assets, margins, and investor profit splits.</p>
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
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold w-24">Asset</th>
                                <th className="px-6 py-4 font-semibold">Gemstone Details</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Total List Price</th>
                                <th className="px-6 py-4 font-semibold text-[#CA0A7F]">Investor Share</th>
                                <th className="px-6 py-4 font-semibold text-blue-600">Admin Recovery</th>
                                <th className="px-6 py-4 font-semibold">Visibility</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center text-gray-400">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-[#CA0A7F]" />
                                        Syncing with Vault...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-400">No products found.</td>
                                </tr>
                            ) : products.map((product) => {
                                const stats = calculateFinancials(product);
                                return (
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
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <MapPin size={13} className="text-gray-400" />
                                                {product?.location || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Wallet size={14} className="text-gray-400" />
                                                <span className="text-sm font-bold text-gray-900">Rs. {stats.totalListPrice.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.portal !== "PUBLIC" ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-[#CA0A7F]">
                                                        <TrendingUp size={12} />
                                                        <span className="text-sm font-bold">Rs. {stats.investorShare.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 font-medium bg-pink-50/50 px-1.5 py-0.5 rounded border border-pink-100 w-fit">
                                                        {stats.margin}% Margin | {stats.split}% Split
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase">Direct Sale</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-blue-700">
                                                    <Landmark size={12} />
                                                    <span className="text-sm font-bold">Rs. {stats.adminRecovery.toLocaleString()}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 italic">Total minus Inv. Share</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getPortalStyle(product.portal)}`}>
                                                {product.portal}
                                            </span>
                                            <div className="text-[10px] text-gray-400 mt-1 ml-1">{product?.status || "Available"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/products/formbox/${product._id}`}>
                                                    <button className="p-2 text-gray-400 hover:text-[#CA0A7F] hover:bg-pink-50 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product._id, product.name)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* --- PROFESSIONAL PAGINATION FOOTER --- */}
                <div className="bg-white border-t border-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 font-medium order-2 sm:order-1">
                        Showing <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, paginationInfo.totalProducts)}</span> of <span className="text-gray-900">{paginationInfo.totalProducts}</span> assets
                    </p>

                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <button
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Professional Numbered Pagination */}
                        {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                // Show first, last, and 1 page buffer around current
                                return page === 1 || 
                                       page === paginationInfo.totalPages || 
                                       (page >= currentPage - 1 && page <= currentPage + 1);
                            })
                            .map((page, index, array) => {
                                const elements = [];
                                // Add ellipsis for gaps
                                if (index > 0 && page - array[index - 1] > 1) {
                                    elements.push(
                                        <span key={`sep-${page}`} className="px-2 text-gray-400 text-xs">...</span>
                                    );
                                }
                                elements.push(
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`min-w-[36px] h-9 rounded-lg text-xs font-bold transition-all ${
                                            currentPage === page
                                                ? "bg-[#CA0A7F] text-white shadow-sm shadow-[#CA0A7F]/30"
                                                : "text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                                return elements;
                            })}

                        <button
                            disabled={currentPage >= paginationInfo.totalPages || isLoading}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 ml-1 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}