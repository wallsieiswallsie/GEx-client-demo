import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { addPackageStatus, fetchBatchKapalDetailApi } from "../../../utils/api";

export default function UpdateStatusBatchModal({ batch, onClose, onUpdated }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(batch.status || "");

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();
    try {
      const resJson = await fetchBatchKapalDetailApi(batch.id);
      const batchData = resJson.data;

      if (!batchData || !batchData.packages || batchData.packages.length === 0) {
        alert("Tidak ada paket dalam batch ini");
        return;
      }

      await addPackageStatus(null, 3, batch.id);

      alert("Semua paket dalam batch berhasil diupdate ke status 3!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update status batch");
    }
  };

  const handleSubmit4 = async (e) => {
    e.preventDefault();
    try {
      const resJson = await fetchBatchKapalDetailApi(batch.id);
      const batchData = resJson.data;

      if (!batchData || !batchData.packages || batchData.packages.length === 0) {
        alert("Tidak ada paket dalam batch ini");
        return;
      }

      await addPackageStatus(null, 4, batch.id);

      alert("Semua paket dalam batch berhasil diupdate ke status 4!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update status batch");
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-container bg-white rounded-3xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="modal-title text-2xl font-bold text-[#3e146d] mb-6 text-center">
          Update Status Batch
        </h2>

        {user?.role === "Manager Main Warehouse" && (
          <form onSubmit={handleSubmit3} className="mb-4">
            <button
              type="submit"
              className="w-full bg-[#3e146d] hover:bg-[#5b2490] text-white font-bold py-3 px-6 rounded-3xl shadow-lg hover:shadow-xl transition"
            >
              Sudah Berangkat
            </button>
          </form>
        )}

        {user?.role === "Manager Destination Warehouse" && (
          <form onSubmit={handleSubmit4}>
            <button
              type="submit"
              className="w-full bg-[#3e146d] hover:bg-[#5b2490] text-white font-bold py-3 px-6 rounded-3xl shadow-lg hover:shadow-xl transition"
            >
              Sudah Sampai
            </button>
          </form>
        )}
      </div>
    </div>
  );
}