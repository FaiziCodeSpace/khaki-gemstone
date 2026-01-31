import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,UserStar, Package, ListTree,
  ShoppingCart, TrendingUp, History,
  Menu, X, ShieldCheck, LogOut, NotebookText,
  Loader2
} from "lucide-react";
import { fetchDashboardMetrics } from "../../services/adminServices/dashboardMatricsService";

export default function AdminSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  // Changed: isInitialLoading is used for the "hidden" logic, not an early return
  const [isSyncing, setIsSyncing] = useState(true);

  const closeSidebar = () => setIsOpen(false);

  const getMetrics = useCallback(async () => {
    try {
      setIsSyncing(true);
      const dashboardData = await fetchDashboardMetrics();
      setData(dashboardData);
    } catch (err) {
      console.error("Failed to sync metrics");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    getMetrics();

    const interval = setInterval(() => {
      getMetrics(); 
    }, 20000);

    return () => clearInterval(interval);
  }, [getMetrics]);

  const NAV_ITEMS = [
    { to: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "products", icon: Package, label: "Products" },
    { to: "taxonomyControl", icon: ListTree, label: "Taxonomy Control" },
    { to: "applications", icon: NotebookText, label: "Applications", count: data?.pendingApplications },
    { to: "orders", icon: ShoppingCart, label: "Orders", count: data?.newOrders },
    { to: "investors", icon: TrendingUp, label: "Investors" },
    { to: "transactions", icon: History, label: "Transactions", count: data?.newTransactions },
    { to: "AdminManagement", icon: UserStar, label: "Admin Management"}
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-4 z-40">
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Menu size={22} className="text-gray-600" />
        </button>
        <span className="ml-3 font-bold text-[#CA0A7F] tracking-tight text-lg">Admin Panel</span>
      </div>

      {/* --- MOBILE BACKDROP --- */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform 
        transition-transform duration-300 ease-in-out bg-white border-r border-gray-100
        md:relative md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Mobile-Only Header */}
          <div className="flex items-center justify-between p-6 md:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#CA0A7F]" size={24} />
              <h1 className="text-[#CA0A7F] text-xl font-bold tracking-tight">Admin</h1>
            </div>
            <button onClick={closeSidebar} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="hidden md:block h-10" />

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide">
            <div className="flex items-center justify-between px-4 mb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                Main Navigation
              </p>
              {/* HIDDEN LOADER: Only visible when syncing in background */}
              {isSyncing && <Loader2 className="animate-spin text-gray-300" size={12} />}
            </div>

            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <SidebarLink key={item.to} {...item} onClick={closeSidebar} />
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-50 mt-auto">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-red-500 hover:bg-red-50 transition-all duration-200">
              <LogOut size={19} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ icon: Icon, label, to, onClick, count }) {
  return (
    <li>
      <NavLink
        to={`/admin/${to}`}
        onClick={onClick}
        className={({ isActive }) => `
          group flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200
          ${isActive
            ? "bg-[#CA0A7F] text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}
        `}
      >
        {({ isActive }) => (
          <>
            <div className="flex items-center gap-3">
              <Icon
                size={19}
                className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="truncate">{label}</span>
            </div>
            
            {/* Badge: Professionally handles the count display */}
            {count !== undefined && count > 0 && (
              <span className={`
                text-[10px] px-2 py-0.5 rounded-full font-bold
                ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}
              `}>
                {count}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}