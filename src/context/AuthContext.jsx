import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, API_URL } from "../utils/constants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // ================================================================
  // ✅ Saat aplikasi pertama kali dibuka, coba refresh access token
  // ================================================================

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ restore dulu tanpa nunggu refresh
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    // Jika tidak ada refresh token → user dianggap logout
    if (!storedUser || !refreshToken) {
      setInitializing(false);
      return;
    }

    // ✅ Coba refresh access token ke backend
    fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        const data = await res.json();

        // Jika refresh berhasil → simpan access token baru
        if (data.accessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Refresh gagal → logout
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      })
      .catch(() => {
        // Jika terjadi error → anggap refresh gagal
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  // ================================================================
  // ✅ Login: simpan user, access token, refresh token
  // ================================================================
  const login = useCallback(({ userData, accessToken, refreshToken }) => {
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setUser(userData);
    }
  }, []);

  // ================================================================
  // ✅ Logout: hapus semua
  // ================================================================
  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}