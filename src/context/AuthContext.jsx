import React, { useCallback, useState, useEffect } from 'react';
import {
  ACCESS_TOKEN_KEY,
  API_URL,
  AUTH_USER_KEY,
  REFRESH_TOKEN_KEY,
  clearStoredAuth,
  refreshAccessToken,
} from '../services/api/apiClient';
import { AuthContext } from './useAuth';

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

function isTokenValid(token) {
  const payload = decodeJwtPayload(token);

  return Boolean(payload?.exp && payload.exp * 1000 > Date.now());
}

function getStoredUser(token) {
  const payload = decodeJwtPayload(token);
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (storedUser) {
    const userData = JSON.parse(storedUser);
    return {
      user: userData,
      role: userData.role || payload?.role || null,
    };
  }

  return {
    user: payload ? { id: payload.id, role: payload.role } : null,
    role: payload?.role || null,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuthState = (accessToken, userData = null) => {
    const payload = decodeJwtPayload(accessToken);
    const nextUser = userData || getStoredUser(accessToken).user;
    const nextRole = nextUser?.role || payload?.role || null;

    setUser(nextUser);
    setRole(nextRole);
    setIsAuthenticated(Boolean(accessToken && nextUser));
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const legacyToken = localStorage.getItem('auth_token');
        let token = localStorage.getItem(ACCESS_TOKEN_KEY) || legacyToken;

        if (legacyToken && !localStorage.getItem(ACCESS_TOKEN_KEY)) {
          localStorage.setItem(ACCESS_TOKEN_KEY, legacyToken);
        }

        if (token && isTokenValid(token)) {
          applyAuthState(token);
          return;
        }

        if (localStorage.getItem(REFRESH_TOKEN_KEY)) {
          const refreshed = await refreshAccessToken();
          token = refreshed.accessToken;
          applyAuthState(token, refreshed.user);
          return;
        }

        clearStoredAuth();
      } catch (error) {
        console.error('Gagal melakukan pengecekan autentikasi', error);
        clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login: simpan token + data user ke localStorage.
   * @param {object} userData - { id, name, username, role, whatsapp_number, ... }
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   */
  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }

    clearStoredAuth();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const updateUser = useCallback((userData) => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
  }, []);

  /** Helper: ambil token langsung untuk dipakai di fetch/axios */
  const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
