import { useState, useEffect } from "react";
import { fetchInvoiceDetailApi } from "../utils/api";

export const useInvoiceDetail = (id) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const getInvoiceDetail = async () => {
      try {
        const data = await fetchInvoiceDetailApi(id);
        setInvoice(data.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInvoiceDetail();
  }, [id]);

  return { invoice, loading, error };
};