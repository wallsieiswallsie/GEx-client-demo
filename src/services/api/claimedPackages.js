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