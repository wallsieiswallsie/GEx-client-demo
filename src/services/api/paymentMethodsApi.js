import { apiFetch } from "./apiClient";

const buildQuery = ({ keyword = "", is_active = "" } = {}) => {
  const params = new URLSearchParams();

  if (keyword) params.set("keyword", keyword);
  if (is_active !== "") params.set("is_active", is_active);

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const getPaymentMethods = async (params = {}) => {
  const res = await apiFetch(`/payment-methods${buildQuery(params)}`, {
    method: "GET",
  });

  return res.data;
};

export const createPaymentMethod = async (payload) => {
  const res = await apiFetch("/payment-methods", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.data;
};

export const updatePaymentMethod = async (id, payload) => {
  const res = await apiFetch(`/payment-methods/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return res.data;
};

export const deactivatePaymentMethod = async (id) => {
  const res = await apiFetch(`/payment-methods/${id}`, {
    method: "DELETE",
  });

  return res.data;
};
