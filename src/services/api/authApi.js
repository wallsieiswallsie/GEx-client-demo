import { apiFetch } from "./apiClient";

/** endpoints module */
export const authApi = {
  requestOtp: async (whatsapp_number) =>
    apiFetch("/otp", {
      method: "POST",
      body: JSON.stringify({ whatsapp_number }),
    }),

  register: async (payload) =>
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: async (identifier, password) =>
    apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),
};
