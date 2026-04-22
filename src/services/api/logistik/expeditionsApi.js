import { apiFetch } from "./apiClient";

/**
 * Create expedition
 */
export const createExpedition = async (expedition_name) => {
    const res = await apiFetch("/expeditions", {
        method: "POST",
        body: JSON.stringify({ expedition_name }),
    });

    return res.data;
};

/**
 * Get all expeditions
 */
export const getAllExpeditions = async () => {
    const res = await apiFetch("/expeditions", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get expedition by ID
 */
export const getExpeditionById = async (id) => {
    const res = await apiFetch(`/expeditions/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update expedition
 */
export const updateExpedition = async (id, expedition_name) => {
    const res = await apiFetch(`/expeditions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ expedition_name }),
    });

    return res.data;
};

/**
 * Delete expedition
 */
export const deleteExpedition = async (id) => {
    const res = await apiFetch(`/expeditions/${id}`, {
        method: "DELETE",
    });

    return res.data;
};