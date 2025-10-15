// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function ProtectedRoute() {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped) return null; // or a spinner
  return user ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
