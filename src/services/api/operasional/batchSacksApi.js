import { apiFetch } from "../apiClient";

const unwrap = (res) => {
    if (res?.type === "CONFIRMATION_REQUIRED") {
        return res;
    }

    return res.data;
};

export const getBatches = async ({
    batch_type = "SHIP",
    search = "",
}) => {
    const params = new URLSearchParams({
        batch_type,
        search,
    });

    const res = await apiFetch(
        `/operasional/batches?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return unwrap(res);
};

export const getBatchById = async ({
    batch_type,
    batch_id,
}) => {
    const res = await apiFetch(
        `/operasional/batches/${batch_type}/${batch_id}`,
        {
            method: "GET",
        }
    );

    return unwrap(res);
};

export const createShipBatch = async (payload) => {
    const res = await apiFetch("/operasional/batches/ship", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return unwrap(res);
};

export const createPlaneBatch = async (payload) => {
    const res = await apiFetch("/operasional/batches/plane", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return unwrap(res);
};

export const getBatchPackages = async ({
    batch_type,
    batch_id,
    page = 1,
    limit = 20,
    search = "",
}) => {
    const params = new URLSearchParams({
        page,
        limit,
        search,
    });

    const res = await apiFetch(
        `/operasional/batches/${batch_type}/${batch_id}/packages?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return unwrap(res);
};

export const getSacks = async ({
    batch_type,
    batch_id,
}) => {
    const res = await apiFetch(
        `/operasional/batches/${batch_type}/${batch_id}/sacks`,
        {
            method: "GET",
        }
    );

    return unwrap(res);
};

export const createSack = async (payload) => {
    const res = await apiFetch("/operasional/sacks", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return unwrap(res);
};

export const getSackItems = async (sackId) => {
    const res = await apiFetch(`/operasional/sacks/${sackId}`, {
        method: "GET",
    });

    return unwrap(res);
};

export const addPackageToSack = async ({
    sack_id,
    receipt,
    force_move = false,
}) => {
    const res = await apiFetch(
        `/operasional/sacks/${sack_id}/packages`,
        {
            method: "POST",
            body: JSON.stringify({
                receipt,
                force_move,
            }),
        }
    );

    return unwrap(res);
};

export const removePackageFromSack = async ({
    sack_id,
    receipt,
}) => {
    const res = await apiFetch(
        `/operasional/sacks/${sack_id}/packages`,
        {
            method: "DELETE",
            body: JSON.stringify({ receipt }),
        }
    );

    return unwrap(res);
};

export const closeSack = async (sackId) => {
    const res = await apiFetch(`/operasional/sacks/${sackId}/close`, {
        method: "PATCH",
    });

    return unwrap(res);
};

export const sealSack = async (sackId) => {
    const res = await apiFetch(`/operasional/sacks/${sackId}/seal`, {
        method: "PATCH",
    });

    return unwrap(res);
};
