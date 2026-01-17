import { Plus, Wallet, ArrowUpRight, Banknote } from "lucide-react";

const walletDetail = [
  { label: 'Total Balance', value: 70000, color: 'text-indigo-600' },
  { label: 'Invested', value: 10000, color: 'text-emerald-600' },
  { label: 'Remaining', value: 150000, color: 'text-slate-900' }
];

export default function InvestorWallet() {
  return (
    <section className="w-full">
      {/* Header Area: Stacks on mobile, side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Your Wallet</h2>
          <p className="text-sm text-slate-500 font-medium">Manage your funds and investment capital</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 py-3 text-sm text-white font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 w-full sm:w-auto">
          <Plus size={18} strokeWidth={3} />
          <span>Add Balance</span>
        </button>
      </div>

      {/* Stats Grid: 1 column on mobile, 3 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {walletDetail.map((wallet, index) => (
          <div 
            key={index} 
            className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {wallet.label}
              </span>
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                 {index === 0 ? <Wallet size={16} className="text-slate-400 group-hover:text-indigo-600" /> : 
                  index === 1 ? <ArrowUpRight size={16} className="text-slate-400 group-hover:text-emerald-600" /> : 
                  <Banknote size={16} className="text-slate-400 group-hover:text-slate-600" />}
              </div>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-400">Rs</span>
              <h2 className={`text-3xl lg:text-4xl font-black tracking-tight ${wallet.color}`}>
                {wallet.value.toLocaleString()}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}