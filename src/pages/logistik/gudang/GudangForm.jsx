import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { ArrowLeft } from "lucide-react";
import SubPageHeader from "../../../components/layout/SubPageHeader";

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

    const mapOptions = (data) =>
        data.map((item) => ({
            value: item.id,
            label: item.name,
        }));

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // ================= LOAD PROVINCES =================
    useEffect(() => {
        getProvinces().then((res) => {
            setProvinces(mapOptions(res));
        });
    }, []);

    // ================= LOAD EDIT =================
    useEffect(() => {
        if (id) loadEditData();
    }, [id, provinces]);

    const loadEditData = async () => {
        try {
            setLoading(true);
            const data = await getBranchById(id);

            // ===== MATCH PROVINCE =====
            const provinceMatch = provinces.find(
                (p) => p.label === data.province
            );

            let cityMatch = null;
            let districtMatch = null;
            let villageMatch = null;

            if (provinceMatch) {
                const citiesData = await getCities(provinceMatch.value);
                const mappedCities = mapOptions(citiesData);
                setCities(mappedCities);

                cityMatch = mappedCities.find(
                    (c) => c.label === data.city
                );

                if (cityMatch) {
                    const districtsData = await getDistricts(cityMatch.value);
                    const mappedDistricts = mapOptions(districtsData);
                    setDistricts(mappedDistricts);

                    districtMatch = mappedDistricts.find(
                        (d) => d.label === data.district
                    );

                    if (districtMatch) {
                        const villagesData = await getVillages(districtMatch.value);
                        const mappedVillages = mapOptions(villagesData);
                        setVillages(mappedVillages);

                        villageMatch = mappedVillages.find(
                            (v) => v.label === data.village
                        );
                    }
                }
            }

            setForm({
                branch_code: data.branch_code,
                address: data.address,
                province: provinceMatch,
                city: cityMatch,
                district: districtMatch,
                village: villageMatch,
                postal_code: data.postal_code,
                gmap_link: data.gmap_link,
            });

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ================= CASCADING =================
    const handleProvinceChange = async (option) => {
        handleChange("province", option);
        handleChange("city", null);
        handleChange("district", null);
        handleChange("village", null);

        const res = await getCities(option.value);
        setCities(mapOptions(res));
        setDistricts([]);
        setVillages([]);
    };

    const handleCityChange = async (option) => {
        handleChange("city", option);
        handleChange("district", null);
        handleChange("village", null);

        const res = await getDistricts(option.value);
        setDistricts(mapOptions(res));
        setVillages([]);
    };

    const handleDistrictChange = async (option) => {
        handleChange("district", option);
        handleChange("village", null);

        const res = await getVillages(option.value);
        setVillages(mapOptions(res));
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...form,
                province: form.province?.label,
                city: form.city?.label,
                district: form.district?.label,
                village: form.village?.label,
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
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title={id ? "Edit Gudang" : "Tambah Gudang"}
                    leftAction={
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg hover:bg-gray-200"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    }
                />

                <p className="text-xs text-gray-500 mt-1 ml-[42px]">
                    Kelola data gudang dan lokasi distribusi
                </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded-2xl shadow-sm space-y-4"
            >
                <input
                    placeholder="Branch Code"
                    value={form.branch_code}
                    onChange={(e) => handleChange("branch_code", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200"
                />

                <input
                    placeholder="Alamat"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200"
                />

                <Select
                    placeholder="Pilih Provinsi"
                    options={provinces}
                    value={form.province}
                    onChange={handleProvinceChange}
                />

                <Select
                    placeholder="Pilih Kota"
                    options={cities}
                    value={form.city}
                    onChange={handleCityChange}
                    isDisabled={!form.province}
                />

                <Select
                    placeholder="Pilih Kecamatan"
                    options={districts}
                    value={form.district}
                    onChange={handleDistrictChange}
                    isDisabled={!form.city}
                />

                <Select
                    placeholder="Pilih Desa"
                    options={villages}
                    value={form.village}
                    onChange={(val) => handleChange("village", val)}
                    isDisabled={!form.district}
                />

                <input
                    placeholder="Kode Pos"
                    value={form.postal_code}
                    onChange={(e) => handleChange("postal_code", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                <input
                    placeholder="Google Maps Link"
                    value={form.gmap_link}
                    onChange={(e) => handleChange("gmap_link", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-xl text-sm shadow-md hover:opacity-90"
                >
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </form>
        </div>
    );
}