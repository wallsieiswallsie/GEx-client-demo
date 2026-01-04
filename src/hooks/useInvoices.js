import { useState, useEffect } from "react";
import { useApi } from "../utils/api";

export const useInvoices = () => {
  const { request } = useApi();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const getInvoices = async () => {
      try {
        const data = await request("/invoices");
        if (!mounted) return;
        setInvoices(data.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getInvoices();
    return () => (mounted = false);
  }, [request]);

  return { invoices, loading };
};