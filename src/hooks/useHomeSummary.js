import { useReducer, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { apiFetch } from '../services/api/apiClient';

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
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch({ type: 'LOADING' });

    try {
      const json = await apiFetch('/home/summary');
      dispatch({ type: 'SUCCESS', payload: json.data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { ...state, refetch: fetchSummary };
}
