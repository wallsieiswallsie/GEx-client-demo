export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const ACCESS_TOKEN_KEY = "accessToken";

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

  // Request pertama
  let { res, data } = await makeRequest(token);

  // Kalau token expired → refresh
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login";
      throw new Error("Session habis, silakan login ulang");
    }

    try {
      const refreshRes = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshData = await refreshRes.json();

      if (!refreshRes.ok) {
        throw new Error("Refresh token gagal");
      }

      const newAccessToken = refreshData.data.accessToken;

      // simpan token baru
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

      // retry request lama
      ({ res, data } = await makeRequest(newAccessToken));

    } catch (err) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw err;
    }
  }

  //  handle error biasa
  if (!res.ok || data.status === "fail" || data.status === "error") {
    const err = new Error(data.message || "Terjadi kesalahan");
    err.status = res.status;
    throw err;
  }

  return data;
};