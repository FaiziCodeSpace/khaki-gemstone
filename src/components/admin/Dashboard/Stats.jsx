import { useEffect, useState } from "react";
import { 
  Users, Wallet, TrendingUp, ShoppingBag, 
  Package, UserPlus, BarChart3, Clock, Loader2 
} from "lucide-react";
import { fetchDashboardMetrics } from "../../../services/adminServices/dashboardMatricsService";

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const dashboardData = await fetchDashboardMetrics();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };
    getMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="animate-spin text-[#CA0A7F]" size={32} />
      </div>
    );
  }

  // Map the API response to your UI structure
  const stats = [
    { 
      label: "Total Users", 
      value: data?.totalUsers || 0, 
      change: `+${data?.usersGrowthPercent || 0}%`, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
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
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              {stat.change && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  stat.isAlert 
                    ? "bg-red-50 text-red-600 animate-pulse" 
                    : "bg-gray-50 text-gray-500"
                }`}>
                  {stat.change}
                </span>
              )}
            </div>

            <div>
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