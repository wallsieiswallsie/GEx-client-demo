import React from "react";
import { useNavigate } from "react-router-dom";

const AimasModaSelectionPage = () => {
  const navigate = useNavigate();

  const handleClick = (via) => {
    navigate(`/finance/aimas/${via.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">Pilih Moda Transportasi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Card Kapal */}
        <div
          onClick={() => handleClick("Kapal")}
          className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
        >
          <h2 className="text-xl font-semibold text-[#3e146d]">Kapal</h2>
          <p className="text-gray-600">Update laporan kapal</p>
        </div>

        {/* Card Pesawat */}
        <div
          onClick={() => handleClick("Pesawat")}
          className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
        >
          <h2 className="text-xl font-semibold text-[#3e146d]">Pesawat</h2>
          <p className="text-gray-600">Update laporan pesawat</p>
        </div>
      </div>
    </div>
  );
};

export default AimasModaSelectionPage;