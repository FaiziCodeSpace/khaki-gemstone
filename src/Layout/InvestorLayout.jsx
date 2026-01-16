import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/common/Sidebar(Investor)";

const InvestorLayout = () => {
  const location = useLocation();

  if (location.pathname == "/investor/login" || location.pathname == "/investor/register") {
    return <Outlet />
  }
  return (
  <div className="bg-[#F1F1F1] min-h-screen">
    <SideBar />
    <Outlet />
  </div>);
};

export default InvestorLayout;
