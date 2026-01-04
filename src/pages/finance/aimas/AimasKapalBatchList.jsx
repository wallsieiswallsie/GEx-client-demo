import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBatchesKapalApi } from "../../../utils/api";

const AimasKapalBatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBatches = async () => {
      try {
        setLoading(true);
        const res = await fetchBatchesKapalApi();
        setBatches(res.data || res);
      } catch (err) {
        console.error("Gagal memuat batch kapal:", err);
        setError(err.message || "Terjadi kesalahan saat memuat batch kapal.");
      } finally {
        setLoading(false);
      }
    };

    getBatches();
  }, []);

  if (loading) return <div className="p-6 text-center">Memuat daftar batch...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (batches.length === 0) return <div className="p-6 text-center">Belum ada batch kapal tersedia.</div>;

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">Daftar Batch Kapal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {batches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/aimas-kapal/${batch.id}`)}
            className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
          >
            <h2 className="text-xl font-semibold text-[#3e146d]">{batch.id}</h2>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">{batch.nama_kapal.toUpperCase()}</span>
              <p className="font-medium">{batch.tanggal_closing.split("T")[0]}</p>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AimasKapalBatchList;