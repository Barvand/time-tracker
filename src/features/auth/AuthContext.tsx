// AuthProvider.tsx
import React, { createContext, useEffect, useState } from "react";
import { makeRequest } from "../../lib/axios";
import { setAccessToken as setTokenBus } from "../auth/tokenBus";
import type { Role } from "../../types";

type User = { userId: number; email: string; name: string; role: string };

type AuthCtx = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrapped: boolean;
  role: Role;
};

export const AuthContext = createContext<AuthCtx>(null as unknown as AuthCtx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // In your AuthProvider
  useEffect(() => {
    if (!accessToken) return;

    // Refresh 1 minute before expiration (14 min for 15 min token)
    const refreshInterval = setInterval(async () => {
      try {
        const { data } = await makeRequest.post("/auth/refresh");
        if (data?.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (e: any) {
        // Refresh token expired, log out
        setUser(null);
        setAccessToken(null);
        setTokenBus(null);
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  useEffect(() => {
    const hasLoggedInBefore =
      localStorage.getItem("hasLoggedInBefore") === "true";

    if (!hasLoggedInBefore) {
      setBootstrapped(true);
      return;
    }

    (async () => {
      try {
        const { data } = await makeRequest.post("/auth/refresh");

        if (data?.accessToken) {
          setTokenBus(data.accessToken);
          setAccessToken(data.accessToken);

          const me = await makeRequest.get("/auth/me");
          setUser(me.data.user);
        }
      } catch (e: any) {
        setUser(null);
        setAccessToken(null);
        setTokenBus(null);

        if (e.response?.status !== 401) {
          console.error("Unexpected refresh error:", e);
        }
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const login = async (name: string, password: string) => {
    const { data } = await makeRequest.post("/auth/login", { name, password });

    localStorage.setItem("hasLoggedInBefore", "true");
    setTokenBus(data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await makeRequest.post("/auth/logout");
    localStorage.removeItem("hasLoggedInBefore");
    setAccessToken(null);
    setUser(null);
    setTokenBus(null);

    window.location.href = "/"; // Forces navigation
  };
  if (!bootstrapped) return <div>Loading...</div>;

  const role: Role = (user?.role as Role) || "user";

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, bootstrapped, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};
