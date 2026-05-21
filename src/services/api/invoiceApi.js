import {
  ACCESS_TOKEN_KEY,
  API_URL,
  apiFetch,
} from "./apiClient";

export const getInvoices = async ({
  page = 1,
  limit = 10,
  search = "",
  payment_status = "",
  received_status = "",
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    search,
    payment_status,
    received_status,
  });

  const res = await apiFetch(`/invoices?${params.toString()}`, {
    method: "GET",
  });

  return res.data;
};

export const getInvoiceById = async (id) => {
  const res = await apiFetch(`/invoices/${id}`, {
    method: "GET",
  });

  return res.data;
};

export const createInvoice = async (payload) => {
  const res = await apiFetch("/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.data;
};

export const getAvailableInvoicePackages = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    search,
  });

  const res = await apiFetch(`/invoices/packages/available?${params.toString()}`, {
    method: "GET",
  });

  return res.data;
};

export const getActiveInvoicePaymentMethods = async () => {
  const res = await apiFetch("/invoices/payment-methods/active", {
    method: "GET",
  });

  return res.data;
};

export const uploadInvoicePayment = async (id, formData) => {
  const res = await apiFetch(`/invoices/${id}/payments`, {
    method: "POST",
    body: formData,
  });

  return res.data;
};

export const uploadInvoiceReceipt = async (id, formData) => {
  const res = await apiFetch(`/invoices/${id}/receipts`, {
    method: "POST",
    body: formData,
  });

  return res.data;
};

export const cancelInvoice = async (id) => {
  const res = await apiFetch(`/invoices/${id}/cancel`, {
    method: "PATCH",
  });

  return res.data;
};

export const getInvoicePdfUrl = (id) => `${API_URL}/invoices/${id}/pdf`;

export const fetchInvoicePdfBlob = async (id) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const res = await fetch(getInvoicePdfUrl(id), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("Gagal download PDF invoice");
  }

  return await res.blob();
};

export const downloadPdfBlob = (blob, invoiceNumber = "invoice") => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadInvoicePdf = async (id, invoiceNumber = "invoice") => {
  const blob = await fetchInvoicePdfBlob(id);
  downloadPdfBlob(blob, invoiceNumber);
};
