import { useState } from "react";
import { addPackageToBatchPesawatApi } from "../../../utils/api";

export default function AddPackageToBatchPesawatModal({ batchId, onClose, onSuccess }) {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambah = async (e) => {
    e.preventDefault();

    if (!resi.trim()) {
      alert("⚠️ Resi tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const res = await addPackageToBatchPesawatApi(batchId, resi);

      if (res.success || res.status === "success") {
        alert("Paket berhasil ditambahkan ke batch pesawat!");
        setResi("");
        onSuccess?.();
      } else if (res.message?.includes("sudah ada di batch")) {
        alert(`Paket dengan resi ${resi} sudah ada di batch ini.`);
      } else if (res.message?.includes("tidak ditemukan")) {
        alert(`Paket dengan resi ${resi} tidak ditemukan.`);
      } else {
        alert("Gagal menambahkan paket: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.message) {
        alert(err.message);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="modal-container bg-white p-4 rounded shadow-lg w-[350px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">
          Tambah Paket ke Batch Pesawat
        </h2>

        <form onSubmit={handleTambah} className="flex gap-2 mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Masukkan Resi"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              className="border px-2 py-1 rounded w-full pr-8"
              disabled={loading}
            />

            {resi.length > 0 && (
              <button
                type="button"
                onClick={() => setResi("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent p-0 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3e146d] text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "..." : "+"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 w-full"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}