import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../common/Navbar";
import ScrollToTop from "../../utils/ScrollToTop";

const PublicLayout = () => {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
