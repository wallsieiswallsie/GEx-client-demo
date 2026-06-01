import { ACCESS_TOKEN_KEY, API_URL, apiFetch } from "./apiClient";

const unwrap = (res) => res?.data;
const request = async (path, options = {}) => unwrap(await apiFetch(path, options));

const toQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const feedbackCategories = [
  "Aplikasi GEx",
  "Pengiriman di GEx",
  "Customer Service",
  "Kurir",
  "Gudang",
  "Usulan Fitur",
  "Keluhan",
  "Lainnya",
];

export const statusLabels = {
  new: "New",
  reviewed: "Reviewed",
  resolved: "Resolved",
};

export const statusMessages = {
  new: "Masukan Anda telah diterima.",
  reviewed: "Masukan Anda sedang ditinjau oleh tim GEx.",
  resolved: "Masukan Anda telah selesai ditindaklanjuti.",
};

export const createCustomerFeedback = (formData) =>
  request("/customer/feedbacks", {
    method: "POST",
    body: formData,
  });

export const getMyFeedbacks = (params) =>
  request(`/customer/feedbacks${toQuery(params)}`);

export const getMyFeedbackDetail = (id) =>
  request(`/customer/feedbacks/${id}`);

export const getInternalFeedbacks = (params) =>
  request(`/internal/feedbacks${toQuery(params)}`);

export const getInternalFeedbackDetail = (id) =>
  request(`/internal/feedbacks/${id}`);

export const updateInternalFeedbackStatus = (id, status) =>
  request(`/internal/feedbacks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const downloadInternalFeedbacksCsv = async (params = {}) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const response = await fetch(`${API_URL}/internal/feedbacks/export${toQuery(params)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Gagal export data masukan");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "customer-feedbacks.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
