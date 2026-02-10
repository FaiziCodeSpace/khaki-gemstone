import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/common/Navbar"
import ScrollToTop from "../utils/ScrollToTop"

const PublicLayout = () => {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/scan/")) {
    return <Outlet />;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen font-Poppins">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
