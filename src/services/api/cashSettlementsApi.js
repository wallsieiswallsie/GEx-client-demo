import { apiFetch } from "./apiClient";

export const getCashSettlements = async ({
  page = 1,
  limit = 20,
  status = "",
  search = "",
  month = "",
  branch_code = "",
  staff_id = "",
  approval_only = false,
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    status,
    search,
    month,
    branch_code,
    staff_id,
    approval_only: approval_only ? "true" : "",
  });

  const res = await apiFetch(`/cash-settlements?${params.toString()}`, {
    method: "GET",
  });

  return res.data;
};

export const getEligibleCashInvoices = async ({
  page = 1,
  limit = 20,
  search = "",
  month = "",
  via_code = "",
  batch_id = "",
  branch_code = "",
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    search,
    month,
    via_code,
    batch_id,
    branch_code,
  });

  const res = await apiFetch(`/cash-settlements/eligible-invoices?${params.toString()}`, {
    method: "GET",
  });

  return res.data;
};

export const getCashSettlementById = async (id) => {
  const res = await apiFetch(`/cash-settlements/${id}`, {
    method: "GET",
  });

  return res.data;
};

export const createCashSettlement = async (payload) => {
  const res = await apiFetch("/cash-settlements", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.data;
};

export const addCashSettlementItems = async (id, invoiceIds) => {
  const res = await apiFetch(`/cash-settlements/${id}/items`, {
    method: "POST",
    body: JSON.stringify({ invoice_ids: invoiceIds }),
  });

  return res.data;
};

export const removeCashSettlementItem = async (id, itemId) => {
  const res = await apiFetch(`/cash-settlements/${id}/items/${itemId}`, {
    method: "DELETE",
  });

  return res.data;
};

export const submitCashSettlement = async (id, formData) => {
  const res = await apiFetch(`/cash-settlements/${id}/submit`, {
    method: "POST",
    body: formData,
  });

  return res.data;
};

export const approveCashSettlement = async (id) => {
  const res = await apiFetch(`/cash-settlements/${id}/approve`, {
    method: "POST",
  });

  return res.data;
};

export const rejectCashSettlement = async (id, rejectedReason) => {
  const res = await apiFetch(`/cash-settlements/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejected_reason: rejectedReason }),
  });

  return res.data;
};
