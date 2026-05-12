import { apiFetch } from "../apiClient";

const unwrap = (res) => res.data || [];

const request = async (path, options = {}) => unwrap(await apiFetch(path, options));

const jsonOptions = (method, payload) => ({
  method,
  body: JSON.stringify(payload),
});

export const getBannerDashboard = () => request("/content/banner-dashboard");
export const createBannerDashboard = (payload) =>
  request("/content/banner-dashboard", jsonOptions("POST", payload));
export const updateBannerDashboard = (id, payload) =>
  request(`/content/banner-dashboard/${id}`, jsonOptions("PATCH", payload));

export const getDisplayedShipSchedules = () => request("/content/ship-schedules");
export const createDisplayedShipSchedule = (payload) =>
  request("/content/ship-schedules", jsonOptions("POST", payload));
export const updateDisplayedShipSchedule = (id, payload) =>
  request(`/content/ship-schedules/${id}`, jsonOptions("PATCH", payload));
export const reorderDisplayedShipSchedules = (items) =>
  request("/content/ship-schedules/reorder", jsonOptions("PATCH", { items }));

export const getDisplayedBranches = () => request("/content/branches");
export const createDisplayedBranch = (payload) =>
  request("/content/branches", jsonOptions("POST", payload));
export const updateDisplayedBranch = (id, payload) =>
  request(`/content/branches/${id}`, jsonOptions("PATCH", payload));
export const reorderDisplayedBranches = (items) =>
  request("/content/branches/reorder", jsonOptions("PATCH", { items }));

export const getTermsAndConditions = () => request("/content/terms");
export const createTermsAndConditions = (payload) =>
  request("/content/terms", jsonOptions("POST", payload));
export const updateTermsAndConditions = (id, payload) =>
  request(`/content/terms/${id}`, jsonOptions("PATCH", payload));
export const reorderTermsAndConditions = (items) =>
  request("/content/terms/reorder", jsonOptions("PATCH", { items }));
