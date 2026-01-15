import { Outlet } from "react-router-dom";
import { Navbar } from "../common/Navbar";
import ScrollToTop from "../../utils/ScrollToTop";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default PublicLayout;
