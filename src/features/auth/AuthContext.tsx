// AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { makeRequest } from "../../lib/axios";
import { setAccessToken as setTokenBus } from "../auth/tokenBus";
import type { Role } from "../../types";
type User = { userId: number; email: string; username: string; role: string };
type AuthCtx = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrapped: boolean;
  role: Role;
};

export const AuthContext = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    // Optimization: skip calling refresh if user has never logged in
    const hasLoggedInBefore =
      localStorage.getItem("hasLoggedInBefore") === "true";
    if (!hasLoggedInBefore) {
      setBootstrapped(true);
      return;
    }

    (async () => {
      try {
        const { data } = await makeRequest.post("/auth/refresh", null, {
          withCredentials: true,
        });

        if (!data?.accessToken) {
          setBootstrapped(true);
          return;
        }

        setTokenBus(data.accessToken);
        setAccessToken(data.accessToken);

        const me = await makeRequest.get("/auth/me");
        setUser(me.data.user);
      } catch (e: any) {
        // If no cookie (401), ignore silently
        if (e.response?.status !== 401) {
          console.error("Unexpected refresh error:", e);
        }

        setUser(null);
        setAccessToken(null);
        setTokenBus(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await makeRequest.post(
      "/auth/login",
      { email, password },
      { withCredentials: true } // <-- REQUIRED to receive HttpOnly cookie
    );
    localStorage.setItem("hasLoggedInBefore", "true");
    setTokenBus(data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await makeRequest.post("/auth/logout", null, { withCredentials: true });
    localStorage.removeItem("hasLoggedInBefore");
    setAccessToken(null);
    setUser(null);
    setTokenBus(null); // <-- add this
  };
  if (!bootstrapped) return null; // or a small loader

  // Derive the role from the user or set a default value
  const role: Role = (user?.role as Role) || "user";

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, bootstrapped, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};
