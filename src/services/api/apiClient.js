export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const AUTH_USER_KEY = "auth_user";
export const DEMO_ACCESS_TOKEN = "gex-demo-access-token";
const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE || "").toLowerCase() === "true";

let isRefreshing = false;
let refreshPromise = null;

export const clearStoredAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem("auth_token");
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("Session habis, silakan login ulang");
  }

  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.status !== "success" || !data?.data?.accessToken) {
          throw new Error(data.message || "Refresh gagal");
        }

        const {
          accessToken,
          refreshToken: newRefreshToken,
          user,
        } = data.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

        if (user) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        }

        return data.data;
      })
      .finally(() => {
        isRefreshing = false;
      });
  }

  return refreshPromise;
};

export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const demoState = DEMO_MODE
    ? JSON.parse(localStorage.getItem("gex-demo-state") || "{}")
    : {};
  let token = DEMO_MODE && demoState.selectedRole
    ? DEMO_ACCESS_TOKEN
    : localStorage.getItem(ACCESS_TOKEN_KEY);

  const makeRequest = async (accessToken) => {
    const isFormData =
      typeof FormData !== "undefined" &&
      (
        options.body instanceof FormData ||
        Object.prototype.toString.call(options.body) === "[object FormData]"
      );

    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(DEMO_MODE && demoState.selectedRole ? { "X-Demo-Role": demoState.selectedRole } : {}),
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    return { res, data };
  };

  let { res, data } = await makeRequest(token);

  if (!DEMO_MODE && res.status === 401 && path !== "/refresh" && path !== "/logout") {
    try {
      const { accessToken: newAccessToken } = await refreshAccessToken();

      ({ res, data } = await makeRequest(newAccessToken));
    } catch (err) {
      logout();
      throw err;
    }
  }

  if (!res.ok || data.status === "fail" || data.status === "error") {
    const err = new Error(data.message || "Terjadi kesalahan");
    err.status = res.status;
    throw err;
  }

  return data;
};

const logout = () => {
  clearStoredAuth();
  window.location.replace("/login");
};
