import { apiFetch } from "../apiClient";

/**
 * Create pricing rule
 */
export const createPricingRule = async (payload) => {
    const res = await apiFetch("/shipment-pricing-rules", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Get pricing rules by route
 */
export const getPricingRulesByRoute = async (routeId) => {
    const res = await apiFetch(
        `/shipment-pricing-rules/route/${routeId}`,
        {
            method: "GET",
        }
    );

    return res.data;
};

/**
 * Get pricing rule by ID
 */
export const getPricingRuleById = async (id) => {
    const res = await apiFetch(`/shipment-pricing-rules/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update pricing rule
 */
export const updatePricingRule = async (id, payload) => {
    const res = await apiFetch(`/shipment-pricing-rules/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Delete pricing rule
 */
export const deletePricingRule = async (id) => {
    const res = await apiFetch(`/shipment-pricing-rules/${id}`, {
        method: "DELETE",
    });

    return res.data;
};