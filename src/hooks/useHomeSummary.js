import { useReducer, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  data: null,
  isLoading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SUCCESS':
      return { data: action.payload, isLoading: false, error: null };
    case 'ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

/**
 * Hook untuk mengambil ringkasan homepage berbasis role.
 *
 * - Frontend TIDAK menentukan data apa yang tampil.
 * - Token dikirim ke backend, backend memfilter berdasarkan user_id & role dari JWT.
 * - Data sensitif (nomor HP) dimask oleh server sebelum dikirim.
 *
 * @returns {{ data: object|null, isLoading: boolean, error: string|null, refetch: Function }}
 */
export function useHomeSummary() {
  const { getToken, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'LOADING' });

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/home/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      dispatch({ type: 'SUCCESS', payload: json.data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    }
  }, [isAuthenticated, getToken]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { ...state, refetch: fetchSummary };
}
