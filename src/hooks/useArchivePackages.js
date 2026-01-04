import { useState, useCallback } from "react";
import { fetchArchivePackagesApi } from "../utils/api";

export function useArchivePackages() {
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchArchivePackagesApi(params);

        setPackages(res.data.packages || []);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setLimit(res.data.limit || 50);
      } catch (err) {
        console.error("Gagal ambil arsip:", err);
        setError(err.message || "Gagal mengambil data arsip");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { packages, total, page, limit, loading, error, fetchPackages };
}