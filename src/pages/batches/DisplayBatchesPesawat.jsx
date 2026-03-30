import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesPesawatApi } from "../../utils/api";
import UpdateStatusBatchPesawatModal from "../../components/modals/batches/UpdateStatusBatchPesawatModal";
import { Ship, Plane, Plus, Calendar, Weight, User, AlertTriangle } from "lucide-react";

export default function DisplayBatchesPesawat() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchesPesawatApi();
      if (data.success) setBatches(data.data);
    } catch (err) {
      alert("Gagal mengambil data batch pesawat");
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
        <button
          onClick={() => navigate("/batches/kapal")}
          className="flex-1 flex items-center justify-center gap-2 text-gray-500"
        >
          <Ship size={18} /> Kapal Pelni
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl">
          <Plane size={18} /> Pesawat
        </button>
      </div>

      {/* ALERT */}
      <div className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-3 rounded-xl">
        <AlertTriangle size={18} />
        Paket Tidak Lolos X-Ray
      </div>

      {/* LIST */}
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="bg-white rounded-2xl shadow p-4 flex gap-4 items-start"
        >
          {/* ICON */}
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Plane size={20} />
          </div>

          {/* CONTENT */}
          <div className="flex flex-col gap-1 w-full">
            <h2 className="font-bold text-lg">{batch.pic}</h2>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={14} />
              {batch.vendor}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              Kirim: {batch.tanggal_kirim.split("T")[0]}
            </div>

            <div className="flex items-center gap-2 text-sm mt-1">
              <Weight size={14} />
              {batch.total_berat || 0} Kg
            </div>
          </div>
        </div>
      ))}

      {/* FLOAT BUTTON */}
      {(user?.role === "Manager Main Warehouse" ||
        user?.role === "Staff Main Warehouse") && (
        <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <Plus />
        </button>
      )}

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