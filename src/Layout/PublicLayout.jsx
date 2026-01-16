import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/common/Navbar"
import ScrollToTop from "../utils/ScrollToTop"

const PublicLayout = () => {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return <Outlet />;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
