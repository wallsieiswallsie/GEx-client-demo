import { useEffect, useState } from "react";
import { fetchPackagesApi } from "../utils/api";

export function usePackages(initialQuery = {}) {
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialQuery.page || 1);
  const [limit, setLimit] = useState(initialQuery.limit || 50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async (query = {}) => {
    setLoading(true);
    setError(null);

    const finalQuery = {
      filter: query.filter ?? initialQuery.filter ?? "",
      sortBy: query.sortBy ?? initialQuery.sortBy ?? "created_at",
      sortOrder: query.sortOrder ?? initialQuery.sortOrder ?? "desc",
      page: query.page ?? page,
      limit: query.limit ?? limit,
    };

    try {
      // Ambil token dari localStorage atau context
      const token = localStorage.getItem("accessToken");

      const data = await fetchPackagesApi(finalQuery, token);

      setPackages(data.data.packages || []);
      setTotal(data.data.total || 0);
      setPage(data.data.page || 1);
      setLimit(data.data.limit || 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(initialQuery);
  }, []);

  return {
    packages,
    total,
    page,
    limit,
    loading,
    error,
    fetchPackages,
    setPage,
    setLimit,
  };
}