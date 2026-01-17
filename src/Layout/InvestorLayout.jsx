import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/common/Sidebar(Investor)";
import TopNavbar from "../components/common/Top(Investor)";
import { InvestorStats } from "../components/investment/Stats";
// import Navbar from "../components/common/Navbar"; // Assume you have a Navbar

const InvestorLayout = () => {
  const location = useLocation();

  if (location.pathname === "/investor/login" || location.pathname === "/investor/register") {
    return <Outlet />;
  }

  return (
    // h-screen prevents the container from collapsing
    <div className="bg-[#F1F1F1] h-screen flex flex-col overflow-hidden font-jakarta">
      <TopNavbar />
      {/* --- Main Area --- */}
      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        {/* Main content must scroll independently */}
        <main className="flex-1 overflow-y-auto p-6">
          <InvestorStats/>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InvestorLayout;