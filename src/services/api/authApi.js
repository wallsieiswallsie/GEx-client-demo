import { apiFetch } from "./apiClient";

/** endpoints module */
export const authApi = {
  requestOtp: async (payload) =>
    apiFetch("/otp", {
      method: "POST",
      body: JSON.stringify(payload),
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

  requestForgotPasswordOtp: async (whatsapp_number) =>
    apiFetch("/forgot-password/request-otp", {
      method: "POST",
      body: JSON.stringify({ whatsapp_number }),
    }),

  verifyForgotPasswordOtp: async (whatsapp_number, otp) =>
    apiFetch("/forgot-password/verify-otp", {
      method: "POST",
      body: JSON.stringify({ whatsapp_number, otp }),
    }),

  resetPassword: async (resetToken, password, password_confirmation) =>
    apiFetch("/forgot-password/reset", {
      method: "POST",
      body: JSON.stringify({ resetToken, password, password_confirmation }),
    }),
};
