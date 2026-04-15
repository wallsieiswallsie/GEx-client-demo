export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const ACCESS_TOKEN_KEY = "accessToken";

/** low-level fetch wrapper reuseable oleh instance API apapun */
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  
  // Custom JSend normalization 
  if (!res.ok || data.status === 'fail' || data.status === 'error') {
    const err = new Error(data.message || data.error || "Terjadi kesalahan pada server");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  
  return data;
};
