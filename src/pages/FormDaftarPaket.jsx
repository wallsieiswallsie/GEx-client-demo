import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Barcode,
  Calendar,
  Clock,
  FileSearch,
  Info,
  Package,
  Plus,
  Route,
  X,
} from "lucide-react";

import {
  createClaimedPackage,
  getAvailableRouteCodes,
  getMyClaimedPackages,
  submitProblematicClaimRequest,
} from "../services/api/claimedPackages";
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
      const data = await getAvailableRouteCodes();
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
        receipts.map((receipt) => createClaimedPackage(receipt))
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

  return (
    <div className="min-h-dvh bg-gray-50 pb-8 text-slate-900 lg:px-6">
      <section
        className="relative overflow-hidden px-6 pb-16 pt-8 text-white lg:rounded-[32px] lg:px-8"
        style={{
          backgroundImage: "url('/images/header_background/daftarkan_paket.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-t-[50%] bg-gray-50" />

        <div className="relative z-10 flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold leading-tight">Daftarkan Paket</h1>
            <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-white/85">
              Masukkan nomor resi untuk mendaftarkan paketmu.
            </p>
          </div>
        </div>
      </section>

      <main className="relative -mt-10 space-y-5 px-4 lg:mx-auto lg:max-w-5xl lg:px-6">
        <div className="rounded-[28px] border border-white bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <FileSearch className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-950">Input Nomor Resi</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Kamu bisa memasukkan lebih dari satu resi sekaligus.
              </p>
            </div>
          </div>

          <label className="mb-3 block text-sm font-bold text-slate-700">
            Nomor Resi
          </label>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
            {fields.map((field, index) => (
              <div key={index} className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Barcode className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  value={field}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Contoh: GEX1234567890"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-0 pl-16 pr-12 text-base font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                  aria-label="Hapus nomor resi"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddField}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-400 bg-violet-50/30 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
          >
            <Plus className="h-5 w-5" />
            Tambah resi lain
          </button>

          <div className="my-6 flex items-start gap-3 rounded-2xl bg-violet-50 p-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-700 text-white">
              <Info className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-slate-600">
              Pastikan nomor resi sesuai dengan resi dari ekspedisi agar paket mudah ditemukan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isAnyFilled || loading}
            className={`flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold text-white shadow-lg transition ${
              isAnyFilled && !loading
                ? "bg-gradient-to-r from-violet-600 to-violet-800 shadow-violet-600/25 hover:opacity-95"
                : "cursor-not-allowed bg-slate-300 shadow-none"
            }`}
          >
            {loading ? <ButtonLoading text="Mendaftarkan..." /> : "Daftarkan Paket"}
          </button>
        </div>

        {problematicClaim && (
          <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
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
              className="mb-3 mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
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
              className="mb-4 mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">Pilih route code</option>
              {routeOptions.map((route) => (
                <option key={route.id} value={route.generated_route_code}>
                  {route.generated_route_code}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleProblematicSubmit}
              disabled={requestLoading}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-600/15 disabled:bg-slate-300 disabled:shadow-none"
            >
              {requestLoading ? (
                <ButtonLoading text="Mengirim..." />
              ) : (
                "Kirim Request Konfirmasi"
              )}
            </button>
          </div>
        )}

        {pendingPackages.length > 0 && (
          <section className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <h2 className="text-lg font-bold text-slate-900">
              Paket Menunggu
            </h2>

            {pendingPackages.map((pkg) => {
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
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-violet-700" />
                      <p className="font-semibold tracking-wide text-slate-900">
                        {pkg.receipt.toUpperCase()}
                      </p>
                    </div>

                    {pkg.is_problematic ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                        Bermasalah
                        <span className="h-1 w-1 rounded-full bg-orange-500" />
                        Pending
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                        Menunggu
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-[140px_10px_1fr] gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar size={16} />
                      <span>Diklaim pada</span>
                    </div>
                    <div>:</div>
                    <div>{formatDate(pkg.claimed_at)}</div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={16} />
                      <span>Berlaku sampai</span>
                    </div>
                    <div>:</div>
                    <div>{formatDate(pkg.valid_until)}</div>
                  </div>

                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-1/3 animate-pulse bg-yellow-400" />
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
                      className="mt-4 w-full rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white"
                    >
                      Lengkapi Nama & Route Code
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
