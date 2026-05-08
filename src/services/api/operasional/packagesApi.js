import { apiFetch } from "../apiClient";

/**
 * Get all packages
 */
export const getAllPackages = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {
    const params = new URLSearchParams({
        page,
        limit,
        search,
    });

    const res = await apiFetch(
        `/packages?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return res.data;
};

/**
 * Get package by id
 */
export const getPackageById = async (id) => {
    const res = await apiFetch(`/packages/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Create package
 */
export const createPackage = async (formData) => {
    const res = await apiFetch("/packages", {
        method: "POST",
        body: formData,
    });

    return res.data;
};

/**
 * Update package
 */
export const updatePackage = async (id, formData) => {
    const res = await apiFetch(`/packages/${id}`, {
        method: "PUT",
        body: formData,
    });

    return res.data;
};

/**
 * Delete package
 */
export const deletePackage = async (id) => {
    const res = await apiFetch(`/packages/${id}`, {
        method: "DELETE",
    });

    return res.data;
};
