import React from "react";
import { useNavigate } from "react-router-dom";

const DeliverySelectionPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Daftar Request",
      subtitle: "Buat request pengantaran",
      path: "/pengantaran",
    },
    {
      title: "Dalam Pengantaran",
      subtitle: "Pengantaran Aktif",
      path: "/pengantaran_active",
    },
    {
      title: "Arsip",
      subtitle: "Arsip Pengantaran",
      path: "/pengantaran_archive",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {options.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => navigate(opt.path)}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer flex flex-col justify-center items-start gap-2 border border-gray-200"
          >
            <h2 className="text-[#3e146d] font-semibold text-lg">{opt.title}</h2>
            <p className="text-gray-600">{opt.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverySelectionPage;