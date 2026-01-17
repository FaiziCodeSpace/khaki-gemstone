import { Plus, ArrowUp } from 'lucide-react';

export function InvestorStats() {
  const stats = [
    { label: "YOUR PRODUCTS", value: "17" },
    { label: "TOTAL INVESTMENT", value: "Rs 1000" },
    { label: "PROFIT THIS WEEK", value: "Rs 33,223", trend: "+36%" },
    { label: "TOTAL BALANCE", value: "Rs 1000" },
  ];

  return (
    <section className="flex flex-col gap-6 p-4 md:p-0 md:gap-8.5">
      {/* Header: Title and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold md:text-[28px]">Hey Mariana!</h2>
        <div className="flex items-center gap-3">
          <button className="h-10 flex-1 rounded-lg border border-[#D2D2D2] bg-[#EBEBEB] text-[13px] text-[#979797] sm:w-[140px] md:w-[169px] font-bold">
            Check out
          </button>
          <button className="flex h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-[#4F46E5] text-[13px] text-white sm:w-[140px] md:w-[169px] font-bold">
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6.5">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="flex min-h-[100px] flex-col justify-between rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-sm"
          >
            <p className="text-[11px] font-medium tracking-wider text-[#71717A]">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-bold md:text-[22px]">
                {stat.value}
              </h3>
              {stat.trend && (
                <span className="flex items-center text-[13px] font-medium text-[#22C55E]">
                  {stat.trend}
                  <ArrowUp size={14} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}