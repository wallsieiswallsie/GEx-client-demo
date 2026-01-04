import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBatchesPesawatApi } from "../../../utils/api";

const RemuPesawatBatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBatches = async () => {
      try {
        setLoading(true);
        const res = await fetchBatchesPesawatApi();
        setBatches(res.data || res);
      } catch (err) {
        console.error("Gagal memuat batch pesawat:", err);
        setError(err.message || "Terjadi kesalahan saat memuat batch pesawat.");
      } finally {
        setLoading(false);
      }
    };

    getBatches();
  }, []);

  if (loading) return <div className="p-6 text-center">Memuat daftar batch...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (batches.length === 0) return <div className="p-6 text-center">Belum ada batch pesawat tersedia.</div>;

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">Daftar Batch Pesawat</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {batches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/remu-pesawat/${batch.id}`)}
            className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
          >
            <h3 className="text-xl font-semibold text-[#3e146d]">{batch.id}</h3>
            <h4 className="text-gray-700 text-sm">{batch.tanggal_kirim.split('T')[0]}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemuPesawatBatchList;