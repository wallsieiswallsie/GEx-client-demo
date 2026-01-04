import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ConfirmPackagesSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  const allowedRoles = [
    "Manager Destination Warehouse",
    "Manager Main Warehouse",
    "Staff Destination Warehouse"
  ];

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">
        Pilih Aksi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Card Form Konfirmasi (hanya untuk role tertentu) */}
        {allowedRoles.includes(role) && (
          <div
            onClick={() => navigate("/packages/confirm-form")}
            className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
          >
            <h2 className="text-xl font-semibold text-[#3e146d]">
              Form Konfirmasi
            </h2>
            <p className="text-gray-600">
              Masuk ke halaman form konfirmasi paket
            </p>
          </div>
        )}

        {/* Card Daftar Paket Untuk Dipindahkan */}
        <div
          onClick={() => navigate("/packages/confirm-get")}
          className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
        >
          <h2 className="text-xl font-semibold text-[#3e146d]">
            Daftar Paket Untuk Dipindahkan
          </h2>
          <p className="text-gray-600">
            Lihat daftar paket yang akan dipindahkan
          </p>
        </div>
      </div>
    </div>
  );
}