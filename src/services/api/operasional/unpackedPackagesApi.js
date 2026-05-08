import { apiFetch } from "../apiClient";

export const getUnpackedPackages = async ({
    page = 1,
    limit = 10,
    date = "",
    start_date = "",
    end_date = "",
    search = "",
} = {}) => {
    const params = new URLSearchParams({
        page,
        limit,
        date,
        start_date,
        end_date,
        search,
    });

    const res = await apiFetch(
        `/operasional/unpacked-packages?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return res.data;
};

export const getUnpackedPackagesSummary = async ({
    limit = 4,
} = {}) => {
    const params = new URLSearchParams({
        limit,
    });

    const res = await apiFetch(
        `/operasional/unpacked-packages/summary?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return res.data;
};
