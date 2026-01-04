import React, { useEffect, useState } from "react";
import {
  removePackageFromInvoiceApi,
  updatePackageApi,
} from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

function DetailPackageModal({ pkg, invoiceId, onClose, onRemoved }) {
  if (!pkg) return null;

  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const [form, setForm] = useState({
    nama: pkg.nama,
    resi: pkg.resi,             
    ekspedisi: pkg.ekspedisi,   
    panjang: pkg.panjang,
    lebar: pkg.lebar,
    tinggi: pkg.tinggi,
    berat: pkg.berat,
    berat_dipakai: pkg.berat_dipakai,
    harga: pkg.harga,
    kode: pkg.kode,
  });

  useEffect(() => {
    setForm({
      nama: pkg.nama,
      resi: pkg.resi,
      ekspedisi: pkg.ekspedisi,
      panjang: pkg.panjang,
      lebar: pkg.lebar,
      tinggi: pkg.tinggi,
      berat: pkg.berat,
      berat_dipakai: pkg.berat_dipakai,
      harga: pkg.harga,
      kode: pkg.kode,
    });
  }, [pkg]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        nama: form.nama,
        resi: form.resi,              
        ekspedisi: form.ekspedisi,      
        panjang: Number(form.panjang),
        lebar: Number(form.lebar),
        tinggi: Number(form.tinggi),
        berat: Number(form.berat),
        kode: form.kode,
      };

      await updatePackageApi(payload);

      alert("Data paket berhasil diperbarui.");
      setIsEditing(false);
      onClose();
    } catch (error) {
      alert("Gagal update paket: " + error.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleRemoveFromInvoice = async () => {
    if (!window.confirm("Yakin hapus paket ini dari invoice?")) return;

    try {
      await removePackageFromInvoiceApi(invoiceId, Number(pkg.id));
      alert("Paket berhasil dihapus dari invoice");
      if (onRemoved) onRemoved(Number(pkg.id));
      onClose();
    } catch (err) {
      alert(`Gagal hapus paket: ${err.message}`);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-container bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

        {/* Nama */}
        {isEditing ? (
          <input
            name="nama"
            value={form.nama}
            onChange={handleInput}
            className="w-full text-xl font-bold text-center mb-2 border rounded p-2"
          />
        ) : (
          <h1 className="text-xl font-bold text-center mb-2">
            {pkg.nama.toUpperCase()}
          </h1>
        )}

        <div className="flex flex-col gap-2 mb-4">

          {/* Resi - readonly */}
          <div className="text-center text-gray-500">
            {pkg.resi} | {pkg.ekspedisi}
          </div>

        </div>

        {/* Foto */}
        {pkg.photo_url && (
          <div className="text-center mb-4">
            <img
              src={pkg.photo_url}
              alt={`Foto ${pkg.nama}`}
              className="max-w-full max-h-60 object-contain rounded-lg mx-auto"
            />
          </div>
        )}

        {/* Detail */}
        <div className="modal-details mb-4 rounded-xl overflow-hidden">

          {/* Dimensi */}
          <div className="bg-green-100 px-4 py-2 flex justify-between">
            <span className="font-medium">Dimensi</span>

            {!isEditing ? (
              <span>{pkg.panjang} × {pkg.lebar} × {pkg.tinggi}</span>
            ) : (
              <div className="flex gap-1">
                <input name="panjang" value={form.panjang} onChange={handleInput} className="w-14 border rounded p-1" />
                <input name="lebar" value={form.lebar} onChange={handleInput} className="w-14 border rounded p-1" />
                <input name="tinggi" value={form.tinggi} onChange={handleInput} className="w-14 border rounded p-1" />
              </div>
            )}
          </div>

          {/* Berat Asli */}
          <div className="bg-green-200 px-4 py-2 flex justify-between">
            <span className="font-medium">Berat Asli</span>

            {!isEditing ? (
              <span>{pkg.berat} kg</span>
            ) : (
              <input
                name="berat"
                value={form.berat}
                onChange={handleInput}
                className="w-20 border rounded p-1"
              />
            )}
          </div>

          {/* Berat Terpakai (read-only) */}
          <div className="bg-yellow-100 px-4 py-2 flex justify-between">
            <span className="font-medium">Berat Terpakai</span>
            <span className="font-semibold">{pkg.berat_dipakai} kg</span>
          </div>

          {/* VIA (read only selamanya) */}
          <div className="bg-blue-100 px-4 py-2 flex justify-between">
            <span className="font-medium">Via</span>
            <span>{pkg.via}</span>
          </div>
        </div>

        {/* Kode & Harga */}
        <div className="flex flex-row justify-between gap-2 mb-4">

          {isEditing ? (
            <select
              name="kode"
              value={form.kode}
              onChange={handleInput}
              className="border rounded w-full p-2 bg-gray-400 text-white"
            >
              <option value="JKSOQA">JKSOQA</option>
              <option value="JKSOQB">JKSOQB</option>
              <option value="JPSOQA">JPSOQA</option>
              <option value="JPSOQB">JPSOQB</option>
            </select>
          ) : (
            <h3 className="text-center text-[#3e146d] font-bold text-lg">
              {pkg.kode}
            </h3>
          )}

          {/* Harga (READ ONLY) */}
          <h3 className="text-center text-[#3e146d] font-bold text-lg">
            Rp {Number(pkg.harga).toLocaleString("id-ID")}
          </h3>
        </div>

        {/* Tombol */}
        <div className="flex mt-7 flex-row gap-2 justify-center">

          {!isEditing ? (
            <>
              <button
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                onClick={onClose}
              >
                Tutup
              </button>

              {user?.role === "Manager Main Warehouse" && (
              <button
                className="w-full bg-[#3e146d] hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              )}

              {invoiceId && !pkg.finished && (
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  onClick={handleRemoveFromInvoice}
                >
                  Hapus dari Invoice
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => setIsEditing(false)}
              >
                Batal
              </button>

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                onClick={handleSave}
              >
                Simpan
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default DetailPackageModal;