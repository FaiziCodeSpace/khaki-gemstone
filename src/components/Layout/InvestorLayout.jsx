import { Outlet, useLocation } from "react-router-dom";

const InvestorLayout = () => {
  const location = useLocation();

  if (location.pathname == "/investor/login" || location.pathname == "/investor/register") {
    return <Outlet />
  }
  return (<>
    <Outlet />
  </>);
};

export default InvestorLayout;
