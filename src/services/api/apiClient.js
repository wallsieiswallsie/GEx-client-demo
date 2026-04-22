export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const ACCESS_TOKEN_KEY = "accessToken";

let isRefreshing = false;
let refreshPromise = null;

export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const makeRequest = async (accessToken) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    return { res, data };
  };

  let { res, data } = await makeRequest(token);

  // kalau unauthorized → refresh
  if (res.status === 401 && path !== "/refresh") {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      logout();
      throw new Error("Session habis, silakan login ulang");
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = fetch(`${API_URL}/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (!res?.data) throw new Error("Refresh gagal");

            const { accessToken, refreshToken: newRefreshToken } = res.data;

            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            return accessToken;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newAccessToken = await refreshPromise;

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

// helper biar clean
const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem("refreshToken");
  window.location.replace("/login");
};