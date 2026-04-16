import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

/**
 * Decode JWT payload tanpa library eksternal.
 * Hanya membaca bagian payload (index 1), tidak memverifikasi signature.
 * Verifikasi signature dilakukan di server.
 */
function decodeJwtPayload(token) {
  try {
    const base64Payload = token.split('.')[1];
    const json = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const payload = decodeJwtPayload(token);

          // Cek apakah token sudah expired (exp dalam detik Unix)
          if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            // Coba ambil data user lengkap dari localStorage (disimpan saat login)
            const storedUser = localStorage.getItem('auth_user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setRole(userData.role || payload.role);
            } else {
              // Fallback ke data di dalam payload JWT
              setUser({ id: payload.id, role: payload.role });
              setRole(payload.role);
            }
          } else {
            // Token expired — bersihkan storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('Gagal melakukan pengecekan autentikasi', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login: simpan token + data user ke localStorage.
   * @param {object} userData - { id, name, username, role, whatsapp_number, ... }
   * @param {string} token - JWT access token
   */
  const login = (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  /** Helper: ambil token langsung untuk dipakai di fetch/axios */
  const getToken = () => localStorage.getItem('auth_token');

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated, isLoading, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook helper
export const useAuth = () => useContext(AuthContext);
