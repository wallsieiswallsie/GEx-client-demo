import { apiFetch } from "../apiClient";

/**
 * Create shipment route
 */
export const createShipmentRoute = async (payload) => {
    const res = await apiFetch("/shipment-routes", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Get all shipment routes
 */
export const getAllShipmentRoutes = async () => {
    const res = await apiFetch("/shipment-routes", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get shipment route by ID
 */
export const getShipmentRouteById = async (id) => {
    const res = await apiFetch(`/shipment-routes/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update shipment route
 */
export const updateShipmentRoute = async (id, payload) => {
    const res = await apiFetch(`/shipment-routes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Delete shipment route
 */
export const deleteShipmentRoute = async (id) => {
    const res = await apiFetch(`/shipment-routes/${id}`, {
        method: "DELETE",
    });

    return res.data;
};