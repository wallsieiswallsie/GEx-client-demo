import { apiFetch } from "./apiClient";

/**
 * Create claimed package
 */
export const createClaimedPackage = async (receipt) => {
  const res = await apiFetch("/claimed-packages", {
    method: "POST",
    body: JSON.stringify({ receipt }),
  });

  return res.data;
};

/**
 * Get claimed packages (milik user login)
 */
export const getMyClaimedPackages = async () => {
  const res = await apiFetch("/claimed-packages", {
    method: "GET",
  });

  return res.data;
};

export const getMyPackageStatusCounts = async () => {
  const res = await apiFetch("/claimed-packages/status-counts", {
    method: "GET",
  });

  return res.data;
};

export const getMyPackagesByStatus = async () => {
  const res = await apiFetch("/claimed-packages/status-list", {
    method: "GET",
  });

  return res.data;
};

export const getPendingProblematicClaims = async () => {
  const res = await apiFetch("/claimed-packages/problematic-pending", {
    method: "GET",
  });

  return res.data;
};

export const submitProblematicClaimRequest = async (claimId, payload) => {
  const res = await apiFetch(`/claimed-packages/${claimId}/problematic-request`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return res.data;
};

export const getProblematicPackageRequests = async () => {
  const res = await apiFetch("/problematic-package-requests", {
    method: "GET",
  });

  return res.data;
};

export const getInternalProblematicPackages = async () => {
  const res = await apiFetch("/operasional/problematic-packages", {
    method: "GET",
  });

  return res.data;
};

export const confirmProblematicPackageRequest = async (packageId, formData) => {
  const res = await apiFetch(`/problematic-package-requests/${packageId}/confirm`, {
    method: "POST",
    body: formData,
  });

  return res.data;
};

/**
 * Get count claimed packages unconfirmed (milik user login)
 */
export const getUnconfirmedCount = async () => {
  const res = await apiFetch("/claimed-packages/count/unconfirmed", {
    method: "GET",
  });

  return res.data.total;
};
