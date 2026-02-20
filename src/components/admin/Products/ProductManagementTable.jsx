import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, 
    MapPin, Eye, ChevronLeft, ChevronRight, Loader2,
    TrendingUp, Wallet, Landmark, ShoppingBag, X, CheckCircle2
} from "lucide-react";
import { fetchAllProducts, deleteProduct } from "../../../services/productsService";
import { sellInShop } from "../../../services/adminServices/OrdersService";

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

    // --- MODAL STATES ---
    const [sellModal, setSellModal] = useState({ show: false, product: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", paymentMethod: "CASH" });

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAllProducts({ 
                search: searchTerm, 
                limit: itemsPerPage, 
                page: currentPage,
                isAdmin: true
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

    // --- ACTION HANDLERS ---
    const handleConfirmDelete = async () => {
        if (!deleteModal.product) return;
        setIsSubmitting(true);
        try {
            await deleteProduct(deleteModal.product._id);
            setDeleteModal({ show: false, product: null });
            loadProducts();
        } catch (err) {
            alert("Action failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmSell = async (e) => {
        e.preventDefault();
        if (!sellModal.product || !customerInfo.name) return;
        
        setIsSubmitting(true);
        try {
            const payload = {
                customer: { name: customerInfo.name, phone: customerInfo.phone },
                items: [{ product: sellModal.product._id }],
                paymentMethod: customerInfo.paymentMethod
            };

            await sellInShop(payload);
            setSellModal({ show: false, product: null });
            setCustomerInfo({ name: "", phone: "", paymentMethod: "CASH" });
            loadProducts(); // Refresh to show "Sold" status
        } catch (err) {
            alert("Sale failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateFinancials = (product) => {
        const basePrice = product.price || 0;
        const marginPercent = product.profitMargin || 0;
        const profitSharing = product.profitSharingModel || 0; 
        const totalProfitMarkup = basePrice * (marginPercent / 100);
        const totalListPrice = basePrice + totalProfitMarkup;
        const investorShare = totalProfitMarkup * (profitSharing / 100);
        const adminRecovery = totalListPrice - investorShare;
        
        return {
            totalListPrice,
            investorShare,
            adminRecovery,
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
        <div className="space-y-4 font-jakarta relative p-2 md:p-0">
            {/* --- MODAL: SELL IN SHOP --- */}
            {sellModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="text-[#CA0A7F]" size={20} />
                                Process In-Shop Sale
                            </h3>
                            <button onClick={() => setSellModal({ show: false })} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleConfirmSell} className="p-6 space-y-4">
                            <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-white border overflow-hidden">
                                    <img src={`${API_URL}${sellModal.product.imgs_src?.[0]}`} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">{sellModal.product.name}</p>
                                    <p className="text-[10px] text-[#CA0A7F] font-mono">{sellModal.product.productNumber}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Customer Name</label>
                                    <input required value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#CA0A7F]/20 outline-none transition-all text-sm" placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Phone Number (Optional)</label>
                                    <input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#CA0A7F]/20 outline-none transition-all text-sm" placeholder="03xxxxxxxxx" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Payment Method</label>
                                    <select value={customerInfo.paymentMethod} onChange={e => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#CA0A7F]/20 outline-none text-sm">
                                        <option value="CASH">Cash Payment</option>
                                        <option value="POS">Card (POS Machine)</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button disabled={isSubmitting} type="submit" className="w-full bg-[#CA0A7F] hover:bg-[#b0086e] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#CA0A7F]/20">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                    Confirm Sale & Release Profit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: DELETE CONFIRMATION --- */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Remove from Vault?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            This will permanently delete <span className="font-bold text-gray-900">{deleteModal.product.name}</span>. This action cannot be undone.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button onClick={() => setDeleteModal({ show: false, product: null })} className="px-4 py-2.5 border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleConfirmDelete} disabled={isSubmitting} className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all flex items-center justify-center">
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Delete Asset"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Vault Inventory</h2>
                    <p className="text-sm text-gray-500">Manage assets, margins, and investor profit splits.</p>
                </div>

                <Link to="/admin/products/formbox" className="w-full md:w-auto">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#CA0A7F] hover:bg-[#b0086e] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-[#CA0A7F]/20 text-sm">
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

            {/* --- DATA VIEW --- */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
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
                                const isAvailable = product.status === "Available" || product.status === "For Sale";
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
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isAvailable && (
                                                    <button 
                                                        onClick={() => setSellModal({ show: true, product })}
                                                        title="Sell in Shop"
                                                        className="p-2 text-[#CA0A7F] hover:bg-pink-50 rounded-lg transition-colors border border-transparent hover:border-pink-100"
                                                    >
                                                        <ShoppingBag size={16}/>
                                                    </button>
                                                )}
                                                
                                                <Link to={`/admin/products/formbox/${product._id}`}>
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                                </Link>
                                                
                                                <button 
                                                    onClick={() => setDeleteModal({ show: true, product })}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="py-20 text-center text-gray-400">
                            <Loader2 className="animate-spin mx-auto mb-2 text-[#CA0A7F]" />
                            Syncing with Vault...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-10 text-center text-gray-400">No products found.</div>
                    ) : products.map((product) => {
                        const stats = calculateFinancials(product);
                        const isAvailable = product.status === "Available" || product.status === "For Sale";
                        return (
                            <div key={product._id} className="p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                        {product.imgs_src?.[0] ? (
                                            <img src={`${API_URL}${product.imgs_src[0]}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><Eye size={16}/></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono uppercase truncate">{product.productNumber}</span>
                                            <span className="text-[10px] text-[#CA0A7F] font-semibold">{product.gem_size} mm</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                                            <MapPin size={10} /> {product?.location || "N/A"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getPortalStyle(product.portal)}`}>
                                            {product.portal}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-bold">List Price</p>
                                        <p className="text-xs font-bold text-gray-900">Rs. {stats.totalListPrice.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-[#CA0A7F] uppercase font-bold">Investor Share</p>
                                        <p className="text-xs font-bold text-[#CA0A7F]">Rs. {stats.investorShare.toLocaleString()}</p>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-gray-100">
                                        <p className="text-[9px] text-blue-600 uppercase font-bold">Admin Recovery</p>
                                        <p className="text-xs font-bold text-blue-800">Rs. {stats.adminRecovery.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-[10px] text-gray-500 font-medium">
                                        Status: <span className="text-gray-900 font-bold">{product?.status || "Available"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isAvailable && (
                                            <button onClick={() => setSellModal({ show: true, product })} className="p-2.5 bg-pink-50 text-[#CA0A7F] rounded-xl border border-pink-100">
                                                <ShoppingBag size={18}/>
                                            </button>
                                        )}
                                        <Link to={`/admin/products/formbox/${product._id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                                            <Edit2 size={18}/>
                                        </Link>
                                        <button onClick={() => setDeleteModal({ show: true, product })} className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100">
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- PAGINATION FOOTER --- */}
                <div className="bg-white border-t border-gray-50 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium order-2 sm:order-1 text-center sm:text-left">
                        Showing <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, paginationInfo.totalProducts)}</span> of <span className="text-gray-900">{paginationInfo.totalProducts}</span> assets
                    </p>

                    <div className="flex items-center gap-1 order-1 sm:order-2 scale-90 md:scale-100">
                        <button
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    return page === 1 || 
                                           page === paginationInfo.totalPages || 
                                           (page >= currentPage - 1 && page <= currentPage + 1);
                                })
                                .map((page, index, array) => {
                                    const elements = [];
                                    if (index > 0 && page - array[index - 1] > 1) {
                                        elements.push(
                                             <span key={`sep-${page}`} className="px-1 text-gray-400 text-xs">...</span>
                                        );
                                    }
                                    elements.push(
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`min-w-[32px] md:min-w-[36px] h-8 md:h-9 rounded-lg text-xs font-bold transition-all ${
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
                        </div>

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