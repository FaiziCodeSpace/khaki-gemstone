import { useEffect, useState, useCallback } from "react";
import { 
  Users, Wallet, TrendingUp, ShoppingBag, 
  Package, UserPlus, BarChart3, Clock, Loader2 
} from "lucide-react";
import { fetchDashboardMetrics } from "../../../services/adminServices/dashboardMatricsService";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext"; 

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { admin } = useContext(AuthContext);

  const getMetrics = useCallback(async (isSilent = false) => {
    try {
      const dashboardData = await fetchDashboardMetrics();
      setData(dashboardData);
    } catch (err) {
      console.error("Failed to sync metrics in background");
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    getMetrics();

    const interval = setInterval(() => {
      getMetrics(true); // Call silently
    }, 20000);

    // 3. Cleanup on component unmount
    return () => clearInterval(interval);
  }, [getMetrics]);

  // Only show the big spinner on the very first visit
  if (isInitialLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#CA0A7F]" size={32} />
        <p className="text-xs text-gray-400 mt-4 font-medium tracking-widest uppercase">Initializing Dashboard...</p>
      </div>
    );
  }

  let stats = [
    { 
      label: "Total Users", 
      value: data?.totalUsers || 0, 
      change: `+${data?.usersGrowthPercent || 0}%`, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Total Products", 
      value: data?.totalProducts || 0, 
      change: "In Stock", 
      icon: Package, 
      color: "text-teal-600", 
      bg: "bg-teal-50" 
    },
    { 
      label: "Total Orders", 
      value: data?.totalOrders || 0, 
      change: `${data?.newOrders || 0} New`, 
      icon: ShoppingBag, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
  ];

  // Only SUPER_ADMIN sees extra stats
  if (admin?.role === "SUPER_ADMIN") {
    stats = [
      ...stats,
      { 
        label: "Total Investors", 
        value: data?.totalInvestors || 0, 
        change: `${data?.activeInvestors || 0} Active`, 
        icon: UserPlus, 
        color: "text-indigo-600", 
        bg: "bg-indigo-50" 
      },
      { 
        label: "Pending Applications", 
        value: data?.pendingApplications || 0, 
        change: "Review Required", 
        icon: Clock, 
        color: "text-amber-600", 
        bg: "bg-amber-50",
        isAlert: data?.pendingApplications > 0 
      },
      { 
        label: "Total Investments", 
        value: `Rs ${(data?.totalInvestment || 0).toLocaleString()}`, 
        change: `${data?.productsInvested || 0} Products`, 
        icon: TrendingUp, 
        color: "text-emerald-600", 
        bg: "bg-emerald-50" 
      },
      { 
        label: "Revenue Overview", 
        value: `Rs ${(data?.ordersRevenue || 0).toLocaleString()}`, 
        change: "Gross", 
        icon: BarChart3, 
        color: "text-[#CA0A7F]", 
        bg: "bg-pink-50" 
      },
      { 
        label: "Capital Overview", 
        value: `Rs ${(data?.capitalOverview?.active || 0).toLocaleString()}`, 
        change: "Active Equity", 
        icon: Wallet, 
        color: "text-slate-700", 
        bg: "bg-slate-100" 
      },
    ];
  }



  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-800">System Overview</h2>
        <p className="text-sm text-gray-500">Real-time performance and user metrics.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              {stat.change && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  stat.isAlert 
                    ? "bg-red-50 text-red-600 animate-pulse border border-red-100" 
                    : "bg-gray-50 text-gray-500"
                }`}>
                  {stat.change}
                </span>
              )}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-1 duration-700">
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-tight">
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