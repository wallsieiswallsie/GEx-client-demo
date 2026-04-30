import { apiFetch } from "../apiClient";

/**
 * Get provinces
 */
export const getProvinces = async () => {
    const res = await apiFetch("/regions/provinces", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get cities by province
 */
export const getCities = async (provinceId) => {
    const res = await apiFetch(`/regions/cities/${provinceId}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Get districts by city
 */
export const getDistricts = async (cityId) => {
    const res = await apiFetch(`/regions/districts/${cityId}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Get villages by district
 */
export const getVillages = async (districtId) => {
    const res = await apiFetch(`/regions/villages/${districtId}`, {
        method: "GET",
    });

    return res.data;
};