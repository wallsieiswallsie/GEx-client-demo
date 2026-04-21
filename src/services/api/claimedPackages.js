import { apiFetch } from "./apiClient";

/**
 * Create claimed package
 * @param {string} receipt
 */
export const createClaimedPackage = async (receipt) => {
  const res = await apiFetch("/claimed-packages", {
    method: "POST",
    body: JSON.stringify({ receipt }),
  });

  return res.data;
};