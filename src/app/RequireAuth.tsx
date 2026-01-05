// auth/RequireAuth.tsx (simple version)
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function RequireAuth() {
  const { bootstrapped, user } = useAuth();
  const location = useLocation();

  if (!bootstrapped) return null;

  if (!user) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  // Redirect to appropriate dashboard if accessing root
  if (location.pathname === "/") {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <Outlet />;
}
