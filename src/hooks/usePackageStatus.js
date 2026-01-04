import { useState, useCallback } from "react";
import { useApi } from "../utils/api";
import { addPackageStatus, fetchLatestPackageStatusApi } from "../utils/api";

/**
 * Hook untuk menangani status paket (riwayat dan status terakhir).
 * @param {number} packageId optional — ID paket (boleh undefined di awal)
 */
export const usePackageStatus = (packageId) => {
  const { request } = useApi();
  const [statuses, setStatuses] = useState([]);
  const [latestStatus, setLatestStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Tambah / ubah status */
  const addStatus = useCallback(
    async (status, batchId) => {
      if (!packageId) {
        console.warn("addStatus dipanggil tanpa packageId");
        return;
      }
      try {
        setLoading(true);
        const res = await request(() => addPackageStatus(packageId, status, batchId));
        await fetchLatest(); // refresh otomatis
        return res;
      } catch (err) {
        setError(err.message || "Gagal menambahkan status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [packageId, request]
  );

  /** Ambil status terakhir — otomatis pakai packageId dari hook jika parameter kosong */
  const fetchLatest = useCallback(
    async (idParam) => {
      const id = idParam ?? packageId;
      if (!id) {
        console.warn("fetchLatest dipanggil tanpa packageId");
        return { latest: null };
      }

      try {
        setLoading(true);
        const res = await request(() => fetchLatestPackageStatusApi(id));
        setLatestStatus(res.latest || null);
        return res;
      } catch (err) {
        console.warn(`Gagal fetch latest status untuk paket ${id}:`, err.message);
        setError(err.message || "Gagal mengambil status terakhir");
        return { latest: null };
      } finally {
        setLoading(false);
      }
    },
    [request, packageId]
  );

  return { statuses, latestStatus, loading, error, addStatus, fetchLatest };
};