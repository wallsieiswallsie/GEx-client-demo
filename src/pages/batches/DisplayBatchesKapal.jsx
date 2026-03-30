import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesKapalApi, createBatchesKapalApi } from "../../utils/api";
import UpdateStatusBatchModal from "../../components/modals/batches/UpdateStatusBatchModal";
import { Ship, Plane, Plus } from "lucide-react";

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
      alert("Gagal mengambil data batch kapal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

      {/* HEADER */}
      <h1 className="text-xl font-bold">Kloter Pengiriman</h1>

      {/* TOGGLE */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl">
          <Ship size={18} /> Kapal Pelni
        </button>
        <button
          onClick={() => navigate("/batches/pesawat")}
          className="flex-1 flex items-center justify-center gap-2 text-gray-500"
        >
          <Plane size={18} /> Pesawat
        </button>
      </div>

      {/* LIST */}
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2"
        >
          <h2 className="font-bold text-lg">
            KM. {batch.nama_kapal}
          </h2>

          <p className="text-sm text-gray-500">
            Closing: {batch.tanggal_closing.split("T")[0]}
          </p>

          <p className="text-sm text-gray-500">
            Berangkat: {batch.tanggal_berangkat.split("T")[0]}
          </p>

          <p className="text-sm">
            {batch.total_berat || 0} Kg
          </p>
        </div>
      ))}

      {/* FLOAT BUTTON */}
      {(user?.role === "Manager Main Warehouse") && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          <Plus />
        </button>
      )}

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