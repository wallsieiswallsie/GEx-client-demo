import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Clock, Route } from "lucide-react";

import {
  createClaimedPackage,
  getMyClaimedPackages,
  submitProblematicClaimRequest,
} from "../services/api/claimedPackages";
import { getAllShipmentRoutes } from "../services/api/logistik/shipmentRouteApi";
import { ButtonLoading } from "../components/common/Loading";

export default function FormDaftarPaket() {
  const navigate = useNavigate();

  const [fields, setFields] = useState([""]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState("");
  const [routeOptions, setRouteOptions] = useState([]);
  const [problematicClaim, setProblematicClaim] = useState(null);
  const [problematicForm, setProblematicForm] = useState({
    name: "",
    route_code: "",
  });

  // 🔥 FETCH DATA SAAT LOAD
  useEffect(() => {
    fetchPackages();
    fetchRoutes();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getMyClaimedPackages();
      setPackages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await getAllShipmentRoutes();
      setRouteOptions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 20) return;

    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, ""]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields.length === 0 ? [""] : newFields);
  };

  const handleSubmit = async () => {
    const receipts = fields.filter((f) => f.trim() !== "");
    if (receipts.length === 0) return;

    try {
      setLoading(true);
      setError("");

      const results = await Promise.all(
        receipts.map((receipt) =>
          createClaimedPackage(receipt)
        )
      );

      const problematic = results.find(
        (item) => item.needs_problematic_confirmation
      );

      if (problematic) {
        setProblematicClaim(problematic);
        setProblematicForm({
          name: problematic.package?.name || "",
          route_code: "",
        });
      }

      alert("Semua paket berhasil didaftarkan.");

      setFields([""]);

      // 🔥 REFRESH LIST
      fetchPackages();

    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mendaftarkan paket");
    } finally {
      setLoading(false);
    }
  };

  const handleProblematicSubmit = async () => {
    if (!problematicForm.name || !problematicForm.route_code) {
      setError("Nama paket dan route code wajib diisi");
      return;
    }

    try {
      setRequestLoading(true);
      setError("");

      await submitProblematicClaimRequest(problematicClaim.id, problematicForm);

      setProblematicClaim(null);
      setProblematicForm({
        name: "",
        route_code: "",
      });

      await fetchPackages();
    } catch (err) {
      setError(err.message || "Gagal mengirim request konfirmasi");
    } finally {
      setRequestLoading(false);
    }
  };

  const isAnyFilled = fields.some((f) => f.trim() !== "");
  const visiblePackages = packages.filter((pkg) => pkg.final_status !== "tidak_valid");
  const pendingPackages = visiblePackages.filter((pkg) => !pkg.is_confirmed);

  const hasPackages = visiblePackages.length > 0;

  return (
    <div
      className={`min-h-screen flex justify-center bg-no-repeat bg-center 
        ${hasPackages ? "bg-gray-50" : "bg-gray-50 bg-contain"}
      `}
      style={
        !hasPackages
          ? { backgroundImage: "url('/images/empty-package.png')" }
          : {}
      }
    >
      <div className="w-full max-w-md px-4 py-6 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-200 transition"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Daftarkan Paket
          </h1>
        </div>

        {/* FORM */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-4">

          <label className="text-gray-800 font-medium mb-2 block">
            Nomor Resi
          </label>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={field}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Contoh: GEX1234567890"
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-blue-200 
                  focus:outline-none focus:ring-2 focus:ring-blue-800
                  transition bg-gray-50"
                />

                <button
                  onClick={() => handleRemoveField(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                  text-gray-400 hover:text-red-500 transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddField}
            className="flex items-center gap-2 text-blue-900 mt-4 text-sm font-medium hover:opacity-80 transition"
          >
            <Plus size={18} />
            Tambah resi lain
          </button>

          <hr className="my-4 border-gray-100" />

          <button
            onClick={handleSubmit}
            disabled={!isAnyFilled || loading}
            className={`w-full py-3 rounded-2xl font-semibold text-white shadow-md transition
              ${isAnyFilled && !loading
                ? "bg-gradient-to-r from-blue-900 to-red-700 hover:opacity-90"
                : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            {loading ? <ButtonLoading text="Mendaftarkan..." /> : "Daftarkan Paket"}
          </button>
        </div>

        {problematicClaim && (
          <div className="mt-5 bg-white rounded-3xl shadow-lg border border-orange-100 p-4">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                Bermasalah
                <span className="h-1 w-1 rounded-full bg-orange-400" />
                Pending
              </div>

              <h2 className="mt-3 text-sm font-semibold text-gray-900">
                Lengkapi Data Paket Bermasalah
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Resi {problematicClaim.receipt} perlu nama paket dan route code yang benar.
              </p>
            </div>

            <label className="text-sm font-medium text-gray-700">
              Nama Paket
            </label>
            <input
              type="text"
              value={problematicForm.name}
              onChange={(e) =>
                setProblematicForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="mt-1 mb-3 w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Nama paket"
            />

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Route size={16} />
              Route Code Seharusnya
            </label>
            <select
              value={problematicForm.route_code}
              onChange={(e) =>
                setProblematicForm((prev) => ({
                  ...prev,
                  route_code: e.target.value,
                }))
              }
              className="mt-1 mb-4 w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">Pilih route code</option>
              {routeOptions.map((route) => (
                <option key={route.id} value={route.generated_route_code}>
                  {route.generated_route_code}
                </option>
              ))}
            </select>

            <button
              onClick={handleProblematicSubmit}
              disabled={requestLoading}
              className="w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
            >
              {requestLoading ? (
                <ButtonLoading text="Mengirim..." />
              ) : (
                "Kirim Request Konfirmasi"
              )}
            </button>
          </div>
        )}

        {/* 🔥 LIST PAKET */}
        {pendingPackages.length > 0 && (
          <div className="mt-6 space-y-4">

            <h2 className="text-md font-semibold text-gray-800">
              Paket Menunggu
            </h2>

            {pendingPackages
              .map((pkg) => {

                const formatDate = (date) => {
                  return new Date(date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                };

                return (
                  <div
                    key={pkg.id}
                    className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
                  >

                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-blue-700" />
                        <p className="font-semibold text-gray-900 tracking-wide">
                          {pkg.receipt.toUpperCase()}
                        </p>
                      </div>

                      {pkg.is_problematic ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                          Bermasalah
                          <span className="h-1 w-1 rounded-full bg-orange-500" />
                          Pending
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                          Menunggu
                        </span>
                      )}
                    </div>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-[140px_10px_1fr] text-sm text-gray-600 gap-y-2">

                      {/* Diklaim */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} />
                        <span>Diklaim pada</span>
                      </div>
                      <div>:</div>
                      <div>{formatDate(pkg.claimed_at)}</div>

                      {/* Valid Until */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} />
                        <span>Berlaku sampai</span>
                      </div>
                      <div>:</div>
                      <div>{formatDate(pkg.valid_until)}</div>

                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-yellow-400 animate-pulse"></div>
                    </div>

                    {pkg.is_problematic && pkg.route_code === "bermasalah" && (
                      <button
                        type="button"
                        onClick={() => {
                          setProblematicClaim({
                            ...pkg,
                            package: {
                              name: pkg.name || "",
                            },
                          });
                          setProblematicForm({
                            name: pkg.name || "",
                            route_code: "",
                          });
                        }}
                        className="mt-4 w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white"
                      >
                        Lengkapi Nama & Route Code
                      </button>
                    )}

                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
