import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import {
    createBranch,
    getBranchById,
    updateBranch,
} from "../../../services/api/logistik/branchApi";

import {
    getProvinces,
    getCities,
    getDistricts,
    getVillages,
} from "../../../services/master/regionsApi";

export default function GudangForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        branch_code: "",
        address: "",
        province: null,
        city: null,
        district: null,
        village: null,
        postal_code: "",
        gmap_link: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const [loadingRegion, setLoadingRegion] = useState({
        province: false,
        city: false,
        district: false,
        village: false,
    });

    // helper format select
    const mapOptions = (data) =>
        data.map((item) => ({
            value: item.id,
            label: item.name,
        }));

    // load provinces
    useEffect(() => {
        loadProvinces();
    }, []);

    const loadProvinces = async () => {
        try {
            setLoadingRegion((s) => ({ ...s, province: true }));
            const res = await getProvinces();
            setProvinces(mapOptions(res));
        } finally {
            setLoadingRegion((s) => ({ ...s, province: false }));
        }
    };

    // load edit data
    useEffect(() => {
        if (id) loadEditData();
    }, [id]);

    const loadEditData = async () => {
        try {
            setLoading(true);
            const data = await getBranchById(id);

            // set basic form
            setForm((prev) => ({
                ...prev,
                ...data,
            }));

            // preload cascading
            if (data.province) {
                const citiesData = await getCities(data.province);
                const mappedCities = mapOptions(citiesData);
                setCities(mappedCities);

                const selectedCity = mappedCities.find(c => c.value === data.city);

                if (data.city) {
                    const districtsData = await getDistricts(data.city);
                    const mappedDistricts = mapOptions(districtsData);
                    setDistricts(mappedDistricts);

                    const selectedDistrict = mappedDistricts.find(d => d.value === data.district);

                    if (data.district) {
                        const villagesData = await getVillages(data.district);
                        const mappedVillages = mapOptions(villagesData);
                        setVillages(mappedVillages);

                        setForm((prev) => ({
                            ...prev,
                            province: { value: data.province, label: "" },
                            city: selectedCity,
                            district: selectedDistrict,
                            village: mappedVillages.find(v => v.value === data.village),
                        }));
                    }
                }
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // cascading handlers
    const handleProvinceChange = async (option) => {
        handleChange("province", option);
        handleChange("city", null);
        handleChange("district", null);
        handleChange("village", null);

        setCities([]);
        setDistricts([]);
        setVillages([]);

        if (!option) return;

        setLoadingRegion((s) => ({ ...s, city: true }));
        const res = await getCities(option.value);
        setCities(mapOptions(res));
        setLoadingRegion((s) => ({ ...s, city: false }));
    };

    const handleCityChange = async (option) => {
        handleChange("city", option);
        handleChange("district", null);
        handleChange("village", null);

        setDistricts([]);
        setVillages([]);

        if (!option) return;

        setLoadingRegion((s) => ({ ...s, district: true }));
        const res = await getDistricts(option.value);
        setDistricts(mapOptions(res));
        setLoadingRegion((s) => ({ ...s, district: false }));
    };

    const handleDistrictChange = async (option) => {
        handleChange("district", option);
        handleChange("village", null);

        setVillages([]);

        if (!option) return;

        setLoadingRegion((s) => ({ ...s, village: true }));
        const res = await getVillages(option.value);
        setVillages(mapOptions(res));
        setLoadingRegion((s) => ({ ...s, village: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...form,
                province: form.province?.value,
                city: form.city?.value,
                district: form.district?.value,
                village: form.village?.value,
            };

            if (id) {
                await updateBranch(id, payload);
            } else {
                await createBranch(payload);
            }

            navigate("/gudang");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-xl">
            <h1 className="font-bold text-lg mb-4">
                {id ? "Edit Gudang" : "Tambah Gudang"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-3">

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Branch Code"
                    value={form.branch_code}
                    onChange={(e) => handleChange("branch_code", e.target.value)}
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Alamat"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                />

                {/* PROVINCE */}
                <Select
                    placeholder="Pilih Provinsi"
                    options={provinces}
                    value={form.province}
                    onChange={handleProvinceChange}
                    isLoading={loadingRegion.province}
                />

                {/* CITY */}
                <Select
                    placeholder="Pilih Kota"
                    options={cities}
                    value={form.city}
                    onChange={handleCityChange}
                    isDisabled={!form.province}
                    isLoading={loadingRegion.city}
                />

                {/* DISTRICT */}
                <Select
                    placeholder="Pilih Kecamatan"
                    options={districts}
                    value={form.district}
                    onChange={handleDistrictChange}
                    isDisabled={!form.city}
                    isLoading={loadingRegion.district}
                />

                {/* VILLAGE */}
                <Select
                    placeholder="Pilih Desa"
                    options={villages}
                    value={form.village}
                    onChange={(val) => handleChange("village", val)}
                    isDisabled={!form.district}
                    isLoading={loadingRegion.village}
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Kode Pos"
                    value={form.postal_code}
                    onChange={(e) => handleChange("postal_code", e.target.value)}
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Google Maps Link"
                    value={form.gmap_link}
                    onChange={(e) => handleChange("gmap_link", e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </form>
        </div>
    );
}