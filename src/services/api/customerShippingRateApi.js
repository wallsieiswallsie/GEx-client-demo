import { apiFetch } from "./apiClient";

export const getCustomerShippingRateBranches = async () => {
  const res = await apiFetch("/customer/shipping-rates/branches", {
    method: "GET",
  });

  return res.data;
};

export const checkCustomerShippingRate = async (payload) => {
  const res = await apiFetch("/customer/shipping-rates/check", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.data;
};
