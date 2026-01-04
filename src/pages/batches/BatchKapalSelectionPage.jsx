import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BatchKapalSelectionPage() {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
      {/* Card Paket per Karung */}
      <div
        className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition flex flex-col justify-center items-start gap-2 border border-[#3e146d]/20"
        onClick={() => handleClick('/batches/kapal')}
      >
        <h2 className="text-xl font-bold text-[#3e146d]">Paket per Karung</h2>
        <p className="text-gray-700">Lihat daftar karung dan paketnya</p>
      </div>

      {/* Card Semua Paket */}
      <div
        className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition flex flex-col justify-center items-start gap-2 border border-[#3e146d]/20"
        onClick={() => handleClick(`/batches/kapal/${batchId}/all`)}
      >
        <h2 className="text-xl font-bold text-[#3e146d]">Semua Paket</h2>
        <p className="text-gray-700">Lihat semua paket tanpa grup karung</p>
      </div>
    </div>
  );
}