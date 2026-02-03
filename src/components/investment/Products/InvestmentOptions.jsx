import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, MapPin, Tag, TrendingUp, 
  Search, ImageOff, Loader2, AlertCircle, CheckCircle2, X 
} from 'lucide-react';
import { investorService } from '../../../services/investorServices/investmentService';

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export default function InvestmentOptions({ 
  availableProducts = [], 
  filters, 
  setFilters, 
  pagination,
  refreshData 
}) {
  // --- PRODUCTION STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // For Confirmation Modal
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const showNotify = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const executeInvestment = async () => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    try {
      await investorService.investInProduct(selectedProduct._id);
      showNotify(`Successfully invested in ${selectedProduct.name}!`, 'success');
      setSelectedProduct(null);
      if (refreshData) refreshData(); 
    } catch (error) {
      showNotify(error || "Investment failed", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setFilters(prev => ({ ...prev, page: newPage }));
      document.getElementById('investment-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(val).replace('PKR', 'Rs.');
  };

  return (
    <section id="investment-section" className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* --- NATIVE NOTIFICATION TOAST --- */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-right-full duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold">{notification.message}</p>
          <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Investment</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              You are about to invest <span className="font-bold text-slate-900">{formatCurrency(selectedProduct.price)}</span> into 
              <span className="font-bold text-slate-900"> {selectedProduct.name}</span>. This action cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button 
                disabled={isSubmitting}
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                onClick={executeInvestment}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Investment Opportunities</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200 uppercase">
              {pagination?.totalProducts || 0} Assets Found
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Verified active assets available for funding.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input 
            type="text" 
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name, ID, or location..." 
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Asset Details</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Asset ID</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Profit Margin</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expected Return</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {availableProducts.length > 0 ? availableProducts.map((product) => (
              <tr key={product._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0">
                      {product.imgs_src?.[0] ? (
                        <img 
                          src={`${API_URL}${product.imgs_src[0]}`} 
                          alt={product.name} 
                          className="w-full h-full rounded-xl object-cover ring-1 ring-slate-200" 
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                          <ImageOff size={16} />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full ring-1 ring-slate-200 shadow-sm">
                        <TrendingUp size={10} className="text-emerald-600" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[150px]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate max-w-[120px]">{product.location || "Global"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Tag size={12} />
                    {product.productNumber}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 tabular-nums">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-emerald-600">+{product.profitMargin}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Net Margin</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-emerald-600">
                    {formatCurrency((product.profitMargin * product.price / 100) + product.price)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all">
                    Invest Now
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="py-20 text-center text-slate-400 text-sm italic">
                  No assets found for "{filters.search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden divide-y divide-slate-100">
        {availableProducts.length > 0 ? availableProducts.map((product) => (
          <div key={product._id} className="p-5 active:bg-slate-50 transition-colors">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 shrink-0">
                {product.imgs_src?.[0] ? (
                  <img src={`${API_URL}${product.imgs_src[0]}`} alt="" className="w-full h-full rounded-xl object-cover ring-1 ring-slate-200" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageOff size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">{product.name}</h3>
                  <span className="text-sm font-bold text-emerald-600 shrink-0">+{product.profitMargin}%</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {product.location || "Global"}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-400 uppercase">
                  <Tag size={10} /> {product.productNumber}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl mb-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Asset Price</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(product.price)}</p>
              </div>
              <div className="text-center border-l border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Expected Return</p>
                <p className="text-sm font-bold text-emerald-600">
                    {formatCurrency((product.profitMargin * product.price / 100) + product.price)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(product)}
              className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all shadow-md">
              Invest Now
            </button>
          </div>
        )) : (
          <div className="py-20 text-center text-slate-400 text-sm">No assets found.</div>
        )}
      </div>

      {/* --- PAGINATION FOOTER --- */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/10">
        <p className="text-xs font-medium text-slate-500">
          Showing <span className="text-slate-900 font-bold">{availableProducts.length > 0 ? ((filters.page - 1) * filters.limit) + 1 : 0}</span> to <span className="text-slate-900 font-bold">{Math.min(filters.page * filters.limit, pagination?.totalProducts || 0)}</span> of <span className="text-slate-900 font-bold">{pagination?.totalProducts || 0}</span> assets
        </p>

        {pagination?.totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pagination.totalPages > 5 && (pageNum < filters.page - 1 || pageNum > filters.page + 1) && pageNum !== 1 && pageNum !== pagination.totalPages) {
                  if (pageNum === 2 || pageNum === pagination.totalPages - 1) return <span key={pageNum} className="text-slate-300">...</span>;
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      filters.page === pageNum
                        ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= (pagination?.totalPages || 1)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation: fade-in 0.2s ease-out; }
        .scale-in-center { animation: scale-in 0.2s ease-out; }
      `}} />
    </section>
  );
}