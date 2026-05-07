import { apiFetch } from "../apiClient";

/**
 * Create user internal
 */
export const createUserInternal = async (payload) => {
    const res = await apiFetch("/users-internal", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Get all users internal
 */
export const getAllUsersInternal = async () => {
    const res = await apiFetch("/users-internal", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get user internal by ID
 */
export const getUserInternalById = async (id) => {
    const res = await apiFetch(`/users-internal/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update user internal
 */
export const updateUserInternal = async (id, payload) => {
    const res = await apiFetch(`/users-internal/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return res.data;
};

/**
 * Delete user internal
 */
export const deleteUserInternal = async (id) => {
    const res = await apiFetch(`/users-internal/${id}`, {
        method: "DELETE",
    });

    return res.data;
};