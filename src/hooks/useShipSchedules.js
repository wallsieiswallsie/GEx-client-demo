import { useReducer, useEffect, useCallback } from 'react';
import { getDisplayedShipSchedules } from '../services/api/content/contentApi';

const initialState = {
  schedules: [],
  isLoading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SUCCESS':
      return { schedules: action.payload, isLoading: false, error: null };
    case 'ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

/**
 * Hook publik untuk mengambil jadwal kapal/pesawat.
 * Tidak memerlukan autentikasi — data dicache di Redis backend selama 1 jam.
 *
 * @returns {{ schedules: Array, isLoading: boolean, error: string|null, refetch: Function }}
 */
export function useShipSchedules() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSchedules = useCallback(async () => {
    dispatch({ type: 'LOADING' });

    try {
      const schedules = await getDisplayedShipSchedules();
      dispatch({ type: 'SUCCESS', payload: schedules || [] });
    } catch (err) {
      console.error('Gagal ambil jadwal kapal customer:', err);
      dispatch({ type: 'ERROR', payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { ...state, refetch: fetchSchedules };
}
