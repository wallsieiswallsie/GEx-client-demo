import React from "react";
import { useNavigate } from "react-router-dom";

const ServerError = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">500</h1>
      <p className="text-lg mb-6">Terjadi kesalahan pada server. Silakan coba lagi nanti.</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Kembali
      </button>
    </div>
  );
};

export default ServerError;