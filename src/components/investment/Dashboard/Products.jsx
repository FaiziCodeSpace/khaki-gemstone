import { useState } from 'react';
import { Undo2, ChevronLeft, ChevronRight, MapPin, Package, TrendingUp, Circle, Loader2, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

// --- Helpers ---
const formatCurrency = (val) => `Rs ${Number(val).toLocaleString()}`;
const getStatusStyle = (status) => {
    const styles = {
        reserved: 'bg-amber-50 text-amber-700 border-amber-100',
        available: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        sold: 'bg-blue-50 text-blue-700 border-blue-100',
        pending: 'bg-amber-50 text-amber-700 border-amber-100',
        'for sale': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    };
    return styles[status?.toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-100';
};


export default function InvestorProducts({ investments = [], onRefund, processingId }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalItems = investments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = investments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToPage = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);



    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg shadow-sm">
                        <Package size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Your Products</h2>
                        <p className="text-xs text-slate-500 font-medium">Monitor status and performance</p>
                    </div>
                </div>
                <span className="py-1 px-3 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-sm">
                    {totalItems} Total
                </span>
            </div>

            {/* Empty State vs Table Content */}
            {totalItems === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Inbox size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-base">No investments found</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-[280px]">
                        Your active investments will appear here once you start investing in products.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-100 uppercase text-[11px] font-bold text-slate-400 tracking-widest">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Profit</th>
                                    <th className="px-6 py-4">Expected Return</th>
                                    <th className="px-6 py-4">Total Return</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentItems.map((inv) => (
                                    <TableRow
                                        key={inv._id}
                                        inv={inv}
                                        onRefund={onRefund}
                                        isProcessing={processingId === inv._id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden divide-y divide-slate-100">
                        {currentItems.map((inv) => (
                            <MobileCard
                                key={inv._id}
                                inv={inv}
                                onRefund={onRefund}
                                isProcessing={processingId === inv._id}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        goToPage={goToPage}
                    />
                </>
            )}
        </section>
    );
}

function TableRow({ inv, onRefund, isProcessing }) {
    const { product, investmentNumber, investmentAmount, profitMargin, estimatedProfit, totalExpectedReturn } = inv;
    const navigate = useNavigate();
    const handleRowClick = (id) => {
        navigate(`/investor/product/${id}`);
    };
    return (
        <tr onClick={() => handleRowClick(product._id)} className="group hover:bg-slate-50/80 transition-all button">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <img src={`${API_URL}${product?.imgs_src?.[0] || '/placeholder.png'}`} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-100" alt="" />
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{product?.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">{investmentNumber}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4"><StatusBadge status={product?.status} /></td>
            <td className="px-6 py-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{product?.location}</div>
            </td>
            <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(investmentAmount)}</td>
            <td className="px-6 py-4 text-emerald-700 text-xs font-bold">
                <div className="flex items-center gap-0.5"><TrendingUp size={12} />{profitMargin}%</div>
            </td>
            <td className="px-6 py-4 text-emerald-700 text-xs font-bold">{formatCurrency(estimatedProfit)}</td>
            <td className="px-6 py-4 text-emerald-700 text-xs font-bold">{formatCurrency(totalExpectedReturn)}</td>
            <td className="px-6 py-4 text-center">
                <ActionButtons onRefund={() => onRefund(inv._id)} isProcessing={isProcessing} />
            </td>
        </tr>
    );
}

function MobileCard({ inv, onRefund, isProcessing }) {
    const { product, investmentAmount, profitMargin, estimatedProfit, totalExpectedReturn } = inv;
    const navigate = useNavigate();
    const handleRowClick = (id) => {
        navigate(`/investor/product/${id}`);
    };
    return (
        <div onClick={() => handleRowClick(product._id)} className="p-5 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <img src={`${API_URL}${product?.imgs_src?.[0] || '/placeholder.png'}`} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-100" alt="" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">{product?.name}</h3>
                        <StatusBadge status={product?.status} className="mt-1" />
                    </div>
                </div>
                <ActionButtons onRefund={() => onRefund(inv._id)} isProcessing={isProcessing} />
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Location</p>
                    <p className="text-xs font-medium text-slate-700 truncate">{product?.location}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Investment</p>
                    <p className="text-xs font-bold text-slate-900">{formatCurrency(investmentAmount)} <span className="text-emerald-600">({profitMargin}%)</span></p>
                </div>
                <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Est. Profit</p>
                    <p className="text-xs font-bold text-emerald-700">{formatCurrency(estimatedProfit)}</p>
                </div>
                <div className="text-right pt-2 border-t border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Return</p>
                    <p className="text-xs font-bold text-emerald-700">{formatCurrency(totalExpectedReturn)}</p>
                </div>
            </div>
        </div>
    );
}

const StatusBadge = ({ status, className = "" }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyle(status)} ${className}`}>
        <Circle size={6} fill="currentColor" /> {status}
    </span>
);

const ActionButtons = ({ onRefund, isProcessing }) => (
    <div className="flex justify-center gap-2">
        <button
            onClick={(e)=> {
                e.stopPropagation();
                onRefund();
            }}
            disabled={isProcessing}
            title="Request Refund"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isProcessing ? <Loader2 size={18} className="animate-spin text-red-600" /> : <Undo2 size={18} />}
        </button>

    </div>
);

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, goToPage }) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return (
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500">
                Showing <span className="text-slate-900 font-bold">{totalItems === 0 ? 0 : startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 disabled:opacity-30"><ChevronLeft size={18} /></button>
                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => goToPage(i + 1)} className={`w-9 h-9 rounded-lg text-xs font-bold ${currentPage === i + 1 ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{i + 1}</button>
                    ))}
                </div>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border border-slate-200 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
        </div>
    );
}