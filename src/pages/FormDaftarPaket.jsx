import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Clock } from "lucide-react";

import { createClaimedPackage, getMyClaimedPackages } from "../services/api/claimedPackages";
import { ButtonLoading } from "../components/common/Loading";

export default function FormDaftarPaket() {
  const navigate = useNavigate();

  const [fields, setFields] = useState([""]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 FETCH DATA SAAT LOAD
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getMyClaimedPackages();
      setPackages(data);
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

      await Promise.all(
        receipts.map((receipt) =>
          createClaimedPackage(receipt)
        )
      );

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

  const isAnyFilled = fields.some((f) => f.trim() !== "");

  const hasPackages = packages.length > 0;

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

        {/* 🔥 LIST PAKET */}
        {packages.filter(p => !p.is_confirmed).length > 0 && (
          <div className="mt-6 space-y-4">

            <h2 className="text-md font-semibold text-gray-800">
              Paket Menunggu
            </h2>

            {packages
              .filter((pkg) => !pkg.is_confirmed)
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

                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        Menunggu
                      </span>
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

                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
