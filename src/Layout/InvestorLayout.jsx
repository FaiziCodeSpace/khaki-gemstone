import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/investment/Sidebar";
import TopNavbar from "../components/investment/Topnav";

const InvestorLayout = () => {
  const location = useLocation();

  if (location.pathname === "/investor-login" || location.pathname === "/investor-register" || location.pathname === "/investor-application-submitted" || location.pathname === "/investor-terms") {
    return <Outlet />;
  }

  return (
    // h-screen prevents the container from collapsing
    <div className="bg-[#F8F9FA] h-screen flex flex-col overflow-hidden font-jakarta">
      <TopNavbar />
      {/* --- Main Area --- */}
      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        {/* Main content must scroll independently */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InvestorLayout;