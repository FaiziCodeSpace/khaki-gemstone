import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="p-10 text-center">Verifying Admin Session...</div>;

  if (!admin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;