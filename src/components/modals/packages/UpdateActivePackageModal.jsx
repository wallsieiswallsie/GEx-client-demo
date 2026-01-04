import { useState } from "react";

function UpdateActivePackageModal({ onClose, activePengantaranApi }) {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!resi.trim()) {
      setError("Resi tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await activePengantaranApi(resi);

      onClose();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat update status");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container p-6 rounded-3xl shadow-lg bg-white max-w-md w-full mx-auto">
        <h2 className="modal-title text-2xl font-bold text-center mb-4">Aktifkan Pengantaran</h2>

        <input
          type="text"
          placeholder="Masukkan nomor resi"
          value={resi}
          onChange={(e) => setResi(e.target.value)}
          className="w-full border p-3 rounded-2xl mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#3e146d] text-white py-3 rounded-2xl hover:bg-green-700 transition font-semibold"
        >
          {loading ? "Memproses..." : "Sudah di Pick Up"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 bg-gray-400 text-white py-3 rounded-2xl hover:bg-gray-500 transition font-semibold"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default UpdateActivePackageModal;