// src/routes/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  let user = null;
  try {
    user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (e) {
    user = null;
  }

  // 1. If not logged in
  if (!token || !user) {
    return <Navigate to="/investor-login" replace />;
  }

  // 2. If not an investor (e.g., a common user trying to access investor panel)
  if (!user.isInvestor) {
    return <Navigate to="/login" replace />;
  }

  // 3. If application pending
  if (user.status === "pending") {
    return <Navigate to="/investor-application-submitted" replace />;
  }

  // 4. If approved, allow access
  if (user.status === "approved") {
    return children;
  }

  // Default fallback
  return <Navigate to="/investor-login" replace />;
};

export default ProtectedRoute;  