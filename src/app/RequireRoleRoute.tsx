// auth/RequireRole.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { Role } from "../types";

export default function RequireRole({ roles }: { roles: ReadonlyArray<Role> }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/unauthorized" replace />;
  if (!roles.includes(user.role as Role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
