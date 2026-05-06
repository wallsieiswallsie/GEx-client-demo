import { apiFetch } from "../apiClient";

/**
 * Create
 */
export const createItemCategory = async (item_name) => {

    const res = await apiFetch("/item-categories", {
        method: "POST",
        body: JSON.stringify({ item_name }),
    });

    return res.data;
};

/**
 * Get all
 */
export const getAllItemCategories = async () => {

    const res = await apiFetch("/item-categories", {
        method: "GET",
    });

    return res.data;
};

/**
 * Get by id
 */
export const getItemCategoryById = async (id) => {

    const res = await apiFetch(`/item-categories/${id}`, {
        method: "GET",
    });

    return res.data;
};

/**
 * Update
 */
export const updateItemCategory = async (id, item_name) => {

    const res = await apiFetch(`/item-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ item_name }),
    });

    return res.data;
};

/**
 * Delete
 */
export const deleteItemCategory = async (id) => {

    const res = await apiFetch(`/item-categories/${id}`, {
        method: "DELETE",
    });

    return res.data;
};