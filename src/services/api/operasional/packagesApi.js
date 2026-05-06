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
    const token = localStorage.getItem("accessToken");

    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/packages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Gagal membuat paket");
    }

    return data.data;
};

/**
 * Update package
 */
export const updatePackage = async (id, payload) => {
    const res = await apiFetch(`/packages/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
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