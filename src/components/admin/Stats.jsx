import { 
  Users, Wallet, TrendingUp, ShoppingBag, 
  Package, UserPlus, BarChart3, Clock 
} from "lucide-react";

const stats = [
  // --- USER & INVESTOR SECTION ---
  { 
    label: "Total Users", 
    value: "1,239", 
    change: "+12%", 
    icon: Users, 
    color: "text-blue-600", 
    bg: "bg-blue-50" 
  },
  { 
    label: "Total Investors", 
    value: "450", 
    change: "Active", 
    icon: UserPlus, 
    color: "text-indigo-600", 
    bg: "bg-indigo-50" 
  },
  { 
    label: "Pending Applications", 
    value: "12", 
    change: "Review Required", 
    icon: Clock, 
    color: "text-amber-600", 
    bg: "bg-amber-50",
    isAlert: true 
  },
  
  // --- PRODUCT & SALES SECTION ---
  { 
    label: "Total Products", 
    value: "84", 
    change: "In Stock", 
    icon: Package, 
    color: "text-teal-600", 
    bg: "bg-teal-50" 
  },
  { 
    label: "Total Orders", 
    value: "2,840", 
    change: "+154 today", 
    icon: ShoppingBag, 
    color: "text-orange-600", 
    bg: "bg-orange-50" 
  },

  // --- FINANCIAL SECTION ---
  { 
    label: "Total Investments", 
    value: "Rs 8.4M", 
    change: "+3.2%", 
    icon: TrendingUp, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50" 
  },
  { 
    label: "Revenue Overview", 
    value: "Rs 1.2M", 
    change: "This Month", 
    icon: BarChart3, 
    color: "text-[#CA0A7F]", 
    bg: "bg-pink-50" 
  },
  { 
    label: "Capital Overview", 
    value: "Rs 15.2M", 
    change: "Total Equity", 
    icon: Wallet, 
    color: "text-slate-700", 
    bg: "bg-slate-100" 
  },
];

export default function AdminStats() {
  return (
    <div className="space-y-6">
      {/* Optional: Section Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-800">System Overview</h2>
        <p className="text-sm text-gray-500">Real-time performance and user metrics.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lgx:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              {stat.change && (
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  stat.isAlert 
                    ? "bg-red-50 text-red-600 animate-pulse" 
                    : "bg-gray-50 text-gray-500"
                }`}>
                  {stat.change}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 truncate">
                {stat.label}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}