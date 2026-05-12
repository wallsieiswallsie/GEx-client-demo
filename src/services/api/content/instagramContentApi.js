import { apiFetch } from "../apiClient";

const unwrap = (res) => res.data || [];

const buildFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const getInstagramContents = async () => {
  const res = await apiFetch("/content/instagram", { method: "GET" });
  return unwrap(res);
};

export const createInstagramContent = async (payload) => {
  const res = await apiFetch("/content/instagram", {
    method: "POST",
    body: buildFormData(payload),
  });

  return unwrap(res);
};

export const updateInstagramContent = async (id, payload) => {
  const res = await apiFetch(`/content/instagram/${id}`, {
    method: "PATCH",
    body: buildFormData(payload),
  });

  return unwrap(res);
};

export const reorderInstagramContents = async (items) => {
  const res = await apiFetch("/content/instagram/reorder", {
    method: "PATCH",
    body: JSON.stringify({ items }),
  });

  return unwrap(res);
};
