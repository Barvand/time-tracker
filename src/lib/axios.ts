// api.ts
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "../features/auth/tokenBus";

const isLocal = window.location.hostname === "localhost";

const BASE_URL = isLocal
  ? "http://localhost:8800/api"
  : "https://api.bartholomeusberg.com/api";

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach Authorization from the in-memory token bus
makeRequest.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (
      config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track a single in-flight refresh so concurrent 401s await the same promise
let refreshingPromise: Promise<string> | null = null;

// Extend config type locally to mark retried requests
type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

makeRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = (error.config || {}) as RetriableConfig;

    // If unauthorized and not already retried, attempt a refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Kick off a single refresh if none in-flight
        refreshingPromise =
          refreshingPromise ??
          (async () => {
            const { data } = await refreshClient.post("/auth/refresh", null);
            // data.accessToken must be returned by your API
            setAccessToken(data.accessToken);
            return data.accessToken as string;
          })();

        const newToken = await refreshingPromise;
        refreshingPromise = null;

        // Retry the original request with the new token
        original.headers = original.headers ?? {};
        (
          original.headers as Record<string, string>
        ).Authorization = `Bearer ${newToken}`;
        return makeRequest.request(original);
      } catch (e) {
        refreshingPromise = null;
        // Optional: clear token bus so the app knows we're logged out
        setAccessToken(null);
        // Bubble up for caller to handle (e.g., redirect to /login)
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
