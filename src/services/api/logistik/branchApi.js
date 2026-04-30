import { apiFetch } from "../apiClient";

/**
 * Create branch
 */
export const createBranch = async (payload) => {
    const res = await apiFetch("/branches", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Get all branches
 */
export const getAllBranches = async () => {
    const res = await apiFetch("/branches", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get branch by ID
 */
export const getBranchById = async (id) => {
    const res = await apiFetch(`/branches/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update branch
 */
export const updateBranch = async (id, payload) => {
    const res = await apiFetch(`/branches/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Delete branch
 */
export const deleteBranch = async (id) => {
    const res = await apiFetch(`/branches/${id}`, {
        method: "DELETE",
    });

    return res.data;
};