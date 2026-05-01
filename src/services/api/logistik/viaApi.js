import { apiFetch } from "../apiClient";

/**
 * Create via
 */
export const createVia = async (payload) => {
    const res = await apiFetch("/via", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Get all via
 */
export const getAllVia = async () => {
    const res = await apiFetch("/via", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get via by ID
 */
export const getViaById = async (id) => {
    const res = await apiFetch(`/via/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update via
 */
export const updateVia = async (id, payload) => {
    const res = await apiFetch(`/via/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Delete via
 */
export const deleteVia = async (id) => {
    const res = await apiFetch(`/via/${id}`, {
        method: "DELETE",
    });

    return res.data;
};