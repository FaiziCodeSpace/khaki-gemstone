import { Outlet, useLocation } from "react-router-dom";
import AdminSideBar from "../components/admin/Sidebar";

export default function AdminLayout() {
  const location = useLocation();

  if (location.pathname === "/admin-login") {
    return <Outlet />;
  }

  return (
    <div className="bg-[#F8F9FA] h-screen flex overflow-hidden font-jakarta">
      <AdminSideBar />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 mt-20 md:mt-0">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

