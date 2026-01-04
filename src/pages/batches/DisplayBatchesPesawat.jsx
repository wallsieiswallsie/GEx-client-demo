import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesPesawatApi, createBatchesPesawatApi } from "../../utils/api";
import UpdateStatusBatchPesawatModal from "../../components/modals/batches/UpdateStatusBatchPesawatModal";

export default function DisplayBatchesPesawat() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaPIC: "",
    tanggalKirim: "",
    namaVendor: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchesPesawatApi();
      if (data.success) setBatches(data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data batch pesawat");
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
        pic: formData.namaPIC,
        tanggal_kirim: formData.tanggalKirim,
        vendor: formData.namaVendor,
        packageIds: [],
        userId: user?.id || null,
      };

      const res = await createBatchesPesawatApi(payload);
      if (res.success) {
        alert("Batch berhasil dibuat!");
        setShowForm(false);
        setFormData({
          namaPIC: "",
          tanggalKirim: "",
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
        <h1 className="text-2xl font-bold text-[#3e146d]">Daftar Batch Pesawat</h1>

        {(user?.role === "Manager Main Warehouse" ||
          user?.role === "Staff Main Warehouse") && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#3e146d] text-white px-4 py-2 rounded-3xl hover:opacity-90"
          >
            +
          </button>
        )}
      </div>

      {/* ======================================
          BUTTON LIHAT PAKET TIDAK LOLOS XRAY
      ====================================== */}
      <button
        onClick={() => navigate("/packages/failed_xray")}
        className="w-full bg-gray-400 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-red-600 transition"
      >
        Lihat Daftar Paket Tidak Lolos Xray
      </button>  

      {showForm && (
        <form
          onSubmit={handleAddBatch}
          className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-6 flex flex-col gap-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Nama PIC</label>
              <input
                type="text"
                value={formData.namaPIC}
                onChange={(e) =>
                  setFormData({ ...formData, namaPIC: e.target.value })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Tanggal Kirim</label>
              <input
                type="date"
                value={formData.tanggalKirim}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalKirim: e.target.value })
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
            {(user?.role === "Manager Main Warehouse" || user?.role === "Staff Main Warehouse") && (
              <h3 className="text-lg font-bold text-[#3e146d]">PIC: {batch.pic.toUpperCase()}</h3>
            )}

            <p className="text-gray-600">ID: {batch.id}</p>
            <p className="text-gray-600">
              Tanggal Kirim: {batch.tanggal_kirim.split("T")[0]}
            </p>
            
            {(user?.role === "Manager Main Warehouse") && (
            <p className="text-gray-600">Vendor: {batch.vendor.toUpperCase()}</p>
            )}
 
            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={() => navigate(`/batches/pesawat/${batch.id}`)}
                className="bg-[#3e146d] h-10 text-white px-3 py-1 rounded-lg hover:opacity-90"
              >
                Detail
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
        <UpdateStatusBatchPesawatModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}