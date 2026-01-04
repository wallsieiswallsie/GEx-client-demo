import React, { useState } from "react";
import { confirmPackageApi } from "../../utils/api";
import { useApi } from "../../utils/api";

function ConfirmPackageForm() {
  const { request } = useApi();

  const [formData, setFormData] = useState({
    resi: "",
    nama: "",
    kode: "",
  });

  const [errors, setErrors] = useState({
    resi: "",
    nama: "",
    kode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar
    let newErrors = {};

    if (!formData.resi) newErrors.resi = "Resi wajib diisi.";
    if (!formData.nama) newErrors.nama = "Nama wajib diisi.";
    if (!formData.kode) newErrors.kode = "Kode wajib dipilih.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await request(() =>
        confirmPackageApi({
          resi: formData.resi,
          nama: formData.nama,
          kode: formData.kode,
        })
      );

      alert(result.message || "Paket berhasil dikonfirmasi!");

      // Clear form setelah sukses
      setFormData({
        resi: "",
        nama: "",
        kode: "",
      });
      
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Konfirmasi Paket
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">

          {/* RESI */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Resi</label>
            <input
              type="text"
              name="resi"
              value={formData.resi}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.resi && <p className="text-red-500 text-sm">{errors.resi}</p>}
          </div>

          {/* NAMA */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Nama Penerima</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
          </div>

          {/* KODE */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Kode Pengiriman</label>
            <select
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            >
              <option value="" hidden></option>
              <option value="JKSOQA">JKSOQA</option>
              <option value="JKSOQB">JKSOQB</option>
              <option value="JPSOQA">JPSOQA</option>
              <option value="JPSOQB">JPSOQB</option>
            </select>
            {errors.kode && <p className="text-red-500 text-sm">{errors.kode}</p>}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">
            <button
                type="button"
                onClick={() => {
                  setFormData({ resi: "", nama: "", kode: "" });
                }}
                className="flex-1 py-2 bg-gray-300 rounded-lg text-gray-700 
                    font-semibold hover:bg-gray-400 transition"
                >
                Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#3e146d] text-white font-semibold 
                rounded-lg shadow-md hover:opacity-90 transition"
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ConfirmPackageForm;