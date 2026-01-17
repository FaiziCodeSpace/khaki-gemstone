import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Tag, TrendingUp, Search } from 'lucide-react';

export default function InvestmentOptions({ availableProducts = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil((availableProducts?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = availableProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Investment Opportunities</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
              {availableProducts?.length || 0} TOTAL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Verified active assets available for funding.</p>
        </div>
        
        {/* Optional Search/Filter Mockup */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Asset Details</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Asset ID</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expected Return</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentItems.map((product, index) => (
              <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={product.img} alt="" className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full ring-1 ring-slate-200">
                        <TrendingUp size={10} className="text-indigo-600" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    {product.outlet_location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Tag size={12} />
                    {product.product_id}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 tabular-nums">
                  {product.price}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-emerald-600">+{product.profit_margin}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Net Margin</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all">
                    Invest Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {currentItems.map((product, index) => (
          <div key={index} className="p-5 active:bg-slate-50 transition-colors">
            <div className="flex gap-4 mb-4">
              <img src={product.img} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{product.name}</h3>
                  <span className="text-sm font-bold text-emerald-600">+{product.profit_margin}%</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {product.outlet_location}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl mb-4">
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                <p className="text-sm font-bold text-slate-900">{product.price}</p>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</p>
                <p className="text-xs font-mono text-slate-900">{product.product_id}</p>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all">
              Invest Now
            </button>
          </div>
        ))}
      </div>

      {/* Professional Footer */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500">
          Showing <span className="text-slate-900 font-bold">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, availableProducts.length)}</span> of <span className="text-slate-900 font-bold">{availableProducts.length}</span> assets
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </section>
  );
}