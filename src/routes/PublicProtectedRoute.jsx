// src/routes/PublicRoute.js
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, restrictedTo = "user" }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  let user = null;
  try {
    user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (e) {
    user = null;
  }

  // If NOT logged in, let them see the login/register page
  if (!token || !user) {
    return children;
  }

  // If logged in as INVESTOR, redirect to investor dashboard
  if (user.isInvestor) {
    return <Navigate to="/investor/dashboard" replace />;
  }

  // If logged in as COMMON USER, redirect to home or shop
  return <Navigate to="/" replace />;
};

export default PublicRoute;