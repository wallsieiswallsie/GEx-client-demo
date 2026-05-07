import { apiFetch } from "./apiClient";

export const profileApi = {
  getProfile: async () => {
    const res = await apiFetch("/profile");
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await apiFetch("/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  changePassword: async (payload) =>
    apiFetch("/profile/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
