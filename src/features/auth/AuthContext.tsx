// AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import { setAccessToken as setTokenBus } from "../auth/tokenBus";
type User = { id: number; email: string; username: string; role: string };
type AuthCtx = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrapped: boolean;
};

export const AuthContext = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // 1) On first load, try to mint a fresh access token using the HttpOnly refresh cookie
  useEffect(() => {
    (async () => {
      try {
        // must hit your API base, with credentials
        const { data } = await makeRequest.post("/auth/refresh", null, {
          withCredentials: true,
        });

        setTokenBus(data.accessToken); // <-- CRITICAL on reload
        setAccessToken(data.accessToken);

        const me = await makeRequest.get("/auth/me"); // header added by interceptor
        setUser(me.data.user);
      } catch (e) {
        // refresh failed -> stay logged out
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
    setTokenBus(data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await makeRequest.post("/auth/logout", null, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
    setTokenBus(null); // <-- add this
  };
  if (!bootstrapped) return null; // or a small loader

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, bootstrapped }}
    >
      {children}
    </AuthContext.Provider>
  );
};
