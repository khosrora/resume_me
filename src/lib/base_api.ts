import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// In-memory access token to avoid relying solely on cookie immediacy
let inMemoryAccessToken: string | null = Cookies.get("accessToken") || null;

// Attach Authorization header from token if available
baseAPI.interceptors.request.use((config) => {
  const token = inMemoryAccessToken || Cookies.get("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh logic on 401 and retry original request
let refreshPromise: Promise<string> | null = null;

function setAccessTokenEverywhere(accessToken: string) {
  inMemoryAccessToken = accessToken;
  // Persist new access token for ~15 minutes. Guard for browser env.
  if (typeof window !== "undefined") {
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
    Cookies.set("accessToken", accessToken, {
      expires: 0.0105, // ~15 minutes
      path: "/",
      sameSite: "Lax",
      secure: isSecure,
    });
  }
  // Update default header for future requests in this session
  baseAPI.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/get_accessToken`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } }
  );

  const accessToken: string = res.data.accessToken;
  setAccessTokenEverywhere(accessToken);
  return accessToken;
}

baseAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};

    // Avoid trying to refresh if the refresh call itself failed
    const isRefreshCall = originalRequest?.url?.includes("/auth/get_accessToken");

    // If 401, try to refresh once and retry the original request
    if (error?.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            // Reset promise so subsequent 401s can trigger a new refresh cycle
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        // Update header for the retried request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return baseAPI(originalRequest);
      } catch (refreshErr) {
        // On refresh failure, clear tokens and propagate the original error
        inMemoryAccessToken = null;
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default baseAPI;
