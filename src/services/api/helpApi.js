import { apiFetch } from "./apiClient";

const unwrap = (res) => res.data;
const request = async (path, options = {}) => unwrap(await apiFetch(path, options));
const jsonOptions = (method, payload) => ({
  method,
  body: JSON.stringify(payload),
});

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

export const getHelpCategories = () => request("/help/categories");
export const getHelpFaqs = (params) => request(`/help/faqs${toQuery(params)}`);
export const getHelpFaqDetail = (id) => request(`/help/faqs/${id}`);
export const getHelpSettings = () => request("/help/settings");

export const getInternalHelpCategories = () => request("/internal/help/categories");
export const createHelpCategory = (payload) =>
  request("/internal/help/categories", jsonOptions("POST", payload));
export const updateHelpCategory = (id, payload) =>
  request(`/internal/help/categories/${id}`, jsonOptions("PATCH", payload));
export const deleteHelpCategory = (id) =>
  request(`/internal/help/categories/${id}`, { method: "DELETE" });

export const getInternalHelpFaqs = (params) => request(`/internal/help/faqs${toQuery(params)}`);
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

export const getInternalHelpSettings = () => request("/internal/help/settings");
export const updateInternalHelpSettings = (payload) =>
  request("/internal/help/settings", jsonOptions("PATCH", payload));
