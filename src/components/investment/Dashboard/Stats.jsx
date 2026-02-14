import { Plus, ArrowUp } from 'lucide-react';

export function InvestorStats({ externalData }) {
  const BRAND_COLOR = "#CA0A7F";
  const data = externalData;

  const stats = [
    { label: "YOUR PRODUCTS", value: data?.yourProducts || "0" },
    { label: "TOTAL INVESTMENT", value: `Rs ${(data?.totalInvestment || 0).toLocaleString()}` },
    { label: "PROFIT (SOLD)", value: `Rs ${(data?.profitFromSold || 0).toLocaleString()}`, trend: data?.trend },
    { label: "TOTAL BALANCE", value: `Rs ${(data?.totalBalance || 0).toLocaleString()}` },
  ];

  return (
    <section className="flex flex-col gap-6 p-4 md:p-0 md:gap-8.5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black md:text-[28px] text-slate-900 leading-tight">
                Hey {data?.firstName || 'Investor'}!
            </h2>
            <p className="text-xs text-slate-500 font-medium">Your current market standing and earnings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 sm:w-35 md:w-42.25 font-bold hover:bg-slate-100 transition-all">
            Statements
          </button>
          <button 
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] text-white sm:w-35 md:w-42.25 font-bold shadow-lg shadow-pink-200 hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            <Plus size={18} strokeWidth={3} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6.5">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group flex min-h-27.5 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-300"
          >
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-black md:text-[24px] text-slate-900 tracking-tight transition-all duration-500">
                {stat.value}
              </h3>
              {stat.trend && stat.trend !== "+0%" && (
                <span className="flex items-center gap-0.5 text-[13px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {stat.trend}
                  <ArrowUp size={14} strokeWidth={3} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}