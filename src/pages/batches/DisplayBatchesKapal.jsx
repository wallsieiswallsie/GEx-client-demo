import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesKapalApi } from "../../utils/api";
import UpdateStatusBatchModal from "../../components/modals/batches/UpdateStatusBatchModal";
import { Ship, Plane, Plus, Calendar, Anchor, Weight } from "lucide-react";

export default function DisplayBatchesKapal() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

      {/* HEADER */}
      <h1 className="text-xl font-bold">Kloter Pengiriman</h1>

      {/* TOGGLE */}
      <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
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
          className="bg-white rounded-2xl shadow p-4 flex gap-4 items-start"
        >
          {/* ICON */}
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Ship size={20} />
          </div>

          {/* CONTENT */}
          <div className="flex flex-col gap-1 w-full">
            <h2 className="font-bold text-lg">
              KM. {batch.nama_kapal}
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              Closing: {batch.tanggal_closing.split("T")[0]}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Anchor size={14} />
              Berangkat: {batch.tanggal_berangkat.split("T")[0]}
            </div>

            <div className="flex items-center gap-2 text-sm mt-1">
              <Weight size={14} />
              {batch.total_berat || 0} Kg
            </div>
          </div>
        </div>
      ))}

      {/* FLOAT BUTTON */}
      {user?.role === "Manager Main Warehouse" && (
        <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg">
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