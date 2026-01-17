import { useState } from 'react';
import { Undo2, Pen, ChevronLeft, ChevronRight, MapPin, Package, TrendingUp, Circle } from 'lucide-react';

export default function InvestorProducts({ activeProducts = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = activeProducts?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = activeProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Helper to style badges based on status string
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'sold') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* Header Section */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg shadow-sm shadow-purple-200">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Products</h2>
            <p className="text-xs text-slate-500 font-medium">Monitor status and performance</p>
          </div>
        </div>
        <span className="py-1 px-3 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-sm">
          {totalItems} Total
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Profit</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentItems.map((product, index) => (
              <tr key={product.product_id || index} className="group hover:bg-slate-50/80 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.img} alt="" className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-100" />
                    <div>
                        <p className="text-sm font-semibold text-slate-900 leading-none">{product.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">{product.product_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyle(product.status)}`}>
                    <Circle size={6} fill="currentColor" />
                    {product.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin size={14} className="text-slate-400" />
                    {product.outlet_location}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{product.price}</td>
                <td className="px-6 py-4">
                  <div className="text-emerald-700 text-xs font-bold flex items-center gap-0.5">
                    <TrendingUp size={12} />
                    {product.profit_margin}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Undo2 size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Pen size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {currentItems.map((product, index) => (
          <div key={product.product_id || index} className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <img src={product.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{product.name}</h3>
                  <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(product.status)}`}>
                    {product.status || 'Active'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 bg-slate-50 rounded-lg"><Pen size={16} /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Location</p>
                    <p className="text-xs font-medium text-slate-700 truncate">{product.outlet_location}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Investment</p>
                    <p className="text-xs font-bold text-slate-900">{product.price} <span className="text-emerald-600">({product.profit_margin}%)</span></p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500">
          Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(endIndex, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => goToPage(i + 1)} className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all">
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}