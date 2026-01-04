import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesKapalApi, createBatchesKapalApi } from "../../utils/api";
import UpdateStatusBatchModal from "../../components/modals/batches/UpdateStatusBatchModal";

export default function DisplayBatchesKapal() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaKapal: "",
    tanggalClosing: "",
    tanggalBerangkat: "",
    namaVendor: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchesKapalApi();
      if (data.success) setBatches(data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data batch kapal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nama_kapal: formData.namaKapal,
        tanggal_closing: formData.tanggalClosing,
        tanggal_berangkat: formData.tanggalBerangkat,
        vendor: formData.namaVendor,
        packageIds: [],
        userId: user?.id || null,
      };

      const res = await createBatchesKapalApi(payload);
      if (res.success) {
        alert("Batch berhasil dibuat!");
        setShowForm(false);
        setFormData({
          namaKapal: "",
          tanggalClosing: "",
          tanggalBerangkat: "",
          namaVendor: "",
        });
        fetchData();
      } else {
        alert("Gagal membuat batch: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat membuat batch");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="w-full max-w-3xl mb-10 px-4 md:px-6 mx-auto mt-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3e146d]">Daftar Batch Kapal</h1>
        {user?.role === "Manager Main Warehouse" && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#3e146d] text-white px-4 py-2 rounded-3xl hover:opacity-90"
          >
            +
          </button>
        )}
      </div>
      
      {showForm && (
        <form
          onSubmit={handleAddBatch}
          className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-6 flex flex-col gap-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Nama Kapal</label>
              <input
                type="text"
                value={formData.namaKapal}
                onChange={(e) =>
                  setFormData({ ...formData, namaKapal: e.target.value })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Tanggal Closing</label>
              <input
                type="date"
                value={formData.tanggalClosing}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalClosing: e.target.value })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Tanggal Berangkat</label>
              <input
                type="date"
                value={formData.tanggalBerangkat}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalBerangkat: e.target.value })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Vendor</label>
              <input
                type="text"
                value={formData.namaVendor}
                onChange={(e) =>
                  setFormData({ ...formData, namaVendor: e.target.value })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-[#3e146d] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-4 flex flex-col gap-2 hover:shadow-xl transition"
          >
            <h3 className="text-lg font-bold text-[#3e146d]">{batch.nama_kapal.toUpperCase()}</h3>
            <p className="text-gray-600">ID: {batch.id}</p>
            <p className="text-gray-600">
              Closing: {batch.tanggal_closing.split("T")[0]}
            </p>
            <div className="flex flex-col gap-5 mt-2">

              {(user?.role === "Manager Destination Warehouse" ||
                user?.role === "Manager Main Warehouse" ||
                user?.role === "Staff Destination Warehouse") && (
                <button
                  onClick={() => {navigate(`/batches/kapal/${batch.id}/all`);}}
                  className="bg-red-950 h-10 text-white px-3 py-1 rounded-lg hover:opacity-90"
                >
                  Daftar Per Batch
                </button>
              )}

              <button
                onClick={() => {navigate(`/batches/kapal/${batch.id}`);}}
                className="bg-[#3e146d] h-10 text-white px-3 w-full py-1 rounded-lg hover:opacity-90"
              >
                Detail Per Karung
              </button>

              {(user?.role === "Manager Destination Warehouse" ||
                user?.role === "Manager Main Warehouse") && (
                <button
                  onClick={() => setSelectedBatch(batch)}
                  className="bg-yellow-500 h-10 text-white px-3 py-1 rounded-lg hover:opacity-90"
                >
                  Update
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {selectedBatch && (
        <UpdateStatusBatchModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}