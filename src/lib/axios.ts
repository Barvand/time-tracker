import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "../features/auth/tokenBus";

const isLocal = window.location.hostname === "localhost";

const BASE_URL = isLocal
  ? "http://localhost:8800/api"
  : "https://api.totaltiming.app/api";

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
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !original._retry) {
      original._retry = true;

      try {
        refreshingPromise =
          refreshingPromise ??
          (async () => {
            const { data } = await refreshClient.post("/auth/refresh", null);
            setAccessToken(data.accessToken);
            return data.accessToken as string;
          })();

        const newToken = await refreshingPromise;
        refreshingPromise = null;

        // Retry original with new token
        (original.headers as any) = {
          ...(original.headers as any),
          Authorization: `Bearer ${newToken}`,
        };

        return makeRequest.request(original);
      } catch (e) {
        refreshingPromise = null;
        setAccessToken(null);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
