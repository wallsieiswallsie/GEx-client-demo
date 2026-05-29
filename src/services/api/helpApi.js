import { apiFetch } from "./apiClient";

const unwrap = (res) => res?.data;
const request = async (path, options = {}) => unwrap(await apiFetch(path, options));
const jsonOptions = (method, payload) => ({
  method,
  body: JSON.stringify(payload),
});

const firstArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value.filter(Boolean);
  }

  return [];
};

const firstObject = (...values) => {
  for (const value of values) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  }

  return {};
};

export const normalizeHelpCategories = (response) =>
  firstArray(
    response,
    response?.categories,
    response?.data,
    response?.data?.categories,
    response?.data?.data,
    response?.data?.data?.categories
  );

export const normalizeHelpFaqs = (response) =>
  firstArray(
    response,
    response?.faqs,
    response?.data,
    response?.data?.faqs,
    response?.data?.data,
    response?.data?.data?.faqs
  );

export const normalizeHelpSettings = (response) =>
  firstObject(
    response,
    response?.settings,
    response?.data,
    response?.data?.settings,
    response?.data?.data,
    response?.data?.data?.settings
  );

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

export const getHelpCategories = async () => normalizeHelpCategories(await request("/help/categories"));
export const getHelpFaqs = async (params) => normalizeHelpFaqs(await request(`/help/faqs${toQuery(params)}`));
export const getHelpFaqDetail = async (id) => normalizeHelpSettings(await request(`/help/faqs/${id}`));
export const getHelpSettings = async () => normalizeHelpSettings(await request("/help/settings"));

export const getInternalHelpCategories = async () => normalizeHelpCategories(await request("/internal/help/categories"));
export const createHelpCategory = (payload) =>
  request("/internal/help/categories", jsonOptions("POST", payload));
export const updateHelpCategory = (id, payload) =>
  request(`/internal/help/categories/${id}`, jsonOptions("PATCH", payload));
export const deleteHelpCategory = (id) =>
  request(`/internal/help/categories/${id}`, { method: "DELETE" });

export const getInternalHelpFaqs = async (params) => normalizeHelpFaqs(await request(`/internal/help/faqs${toQuery(params)}`));
export const createHelpFaq = (payload) =>
  request("/internal/help/faqs", jsonOptions("POST", payload));
export const updateHelpFaq = (id, payload) =>
  request(`/internal/help/faqs/${id}`, jsonOptions("PATCH", payload));
export const deleteHelpFaq = (id) =>
  request(`/internal/help/faqs/${id}`, { method: "DELETE" });
export const toggleHelpFaqPopular = (id) =>
  request(`/internal/help/faqs/${id}/toggle-popular`, { method: "PATCH" });
export const toggleHelpFaqActive = (id) =>
  request(`/internal/help/faqs/${id}/toggle-active`, { method: "PATCH" });

export const getInternalHelpSettings = async () => normalizeHelpSettings(await request("/internal/help/settings"));
export const updateInternalHelpSettings = (payload) =>
  request("/internal/help/settings", jsonOptions("PATCH", payload));
