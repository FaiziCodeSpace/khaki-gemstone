// src/routes/PublicRoute.js
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const location = useLocation();
  
  let user = null;
  try {
    user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (e) {
    user = null;
  }

  if (!token || !user) return children;

  const status = user.status || user.investor?.status;

  if (status === "pending") {
    return children;
  }

  const investorPaths = ["/investor-register", "/investor-login"];
  if (investorPaths.includes(location.pathname) && !user.isInvestor) {
    return children;
  }

  if (user.isInvestor && status === "approved") {
    return <Navigate to="/investor/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

export default PublicRoute;