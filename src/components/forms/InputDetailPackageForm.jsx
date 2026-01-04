import React, { useRef } from "react";

function InputDetailPackageForm({
  formData,
  errors,
  handleChange,
  handleSave,
  handleCancel,
  handleFileChange,
}) {
  const fileInputRef = useRef(null);

  const onSave = async (e) => {
    e.preventDefault();
    
  if (!formData.ekspedisi) {
    alert("Silakan pilih ekspedisi terlebih dahulu!");
    return;
  }

  if (!formData.tanggal_tiba) {
    alert("Silakan isi tanggal tiba terlebih dahulu!");
    return;
  }

  if (!formData.preview) {
    alert("Silakan tambahkan foto terlebih dahulu!");
    return;
  }

  if (!formData.nama) {
    alert("Silakan isi nama terlebih dahulu!");
    return;
  }

  if (!formData.panjang) {
    alert("Silakan isi data panjang terlebih dahulu!");
    return;
  }

  if (!formData.lebar) {
    alert("Silakan isi data lebar terlebih dahulu!");
    return;
  }

  if (!formData.tinggi) {
    alert("Silakan isi data tinggi terlebih dahulu!");
    return;
  }

  if (!formData.berat) {
    alert("Silakan isi data berat terlebih dahulu!");
    return;
  }

  if (!formData.kode) {
    alert("Silakan isi data kode terlebih dahulu!");
    return;
  }

    await handleSave(e);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const ekspedisiOptions = [
    { value: "J&T Express", color: "bg-pink-200" },
    { value: "Shopee Express", color: "bg-orange-200" },
    { value: "JNE", color: "bg-blue-200" },
    { value: "LEX", color: "bg-green-200" },
    { value: "POS", color: "bg-yellow-200" },
    { value: "TIKI", color: "bg-purple-200" },
    { value: "Wahana", color: "bg-red-200" },
    { value: "Indah Cargo", color: "bg-teal-200" },
    { value: "SiCepat", color: "bg-rose-200" },
    { value: "Anteraja", color: "bg-fuchsia-200" },
    { value: "SAPX", color: "bg-lime-200" },
    { value: "Grab", color: "bg-emerald-200" },
    { value: "Gojek", color: "bg-indigo-200" },
    { value: "Lainnya", color: "bg-gray-200" },
  ];

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          {formData.id ? "Edit Paket" : "Tambah Paket"}
        </h2>

        <form onSubmit={onSave} className="flex flex-col gap-4">

          {/* ====== NAMA ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.nama && (
              <p className="text-red-500 text-sm">{errors.nama}</p>
            )}
          </div>

          {/* ====== RESI ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Resi</label>
            <input
              type="text"
              name="resi"
              value={formData.resi}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.resi && (
              <p className="text-red-500 text-sm">{errors.resi}</p>
            )}
          </div>

          {/* ====== DIMENSI ====== */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Panjang</label>
              <input
                type="number"
                name="panjang"
                value={formData.panjang}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Lebar</label>
              <input
                type="number"
                name="lebar"
                value={formData.lebar}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Tinggi</label>
              <input
                type="number"
                name="tinggi"
                value={formData.tinggi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
          </div>

          {/* ====== BERAT ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Berat</label>
            <input
              type="number"
              name="berat"
              value={formData.berat}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
          </div>

          {/* ====== TANGGAL TIBA ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">
              Tanggal Tiba Tangerang
            </label>
            <input
              type="date"
              name="tanggal_tiba"
              value={formData.tanggal_tiba}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
          </div>

          {/* ====== EKSPEDISI ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Ekspedisi</label>

            <select
              name="ekspedisi"
              value={formData.ekspedisi}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]`}
            >
              <option value="" disabled hidden>
                Pilih Ekspedisi
              </option>

              {ekspedisiOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className={`${opt.color} text-gray-700`}
                >
                  {opt.value}
                </option>
              ))}
            </select>
          </div>

          {/* ====== FOTO ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Foto Paket</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full text-sm text-gray-500"
            />
            {formData.preview && (
              <img
                src={formData.preview}
                alt="Preview paket"
                className="w-32 h-32 object-cover rounded-lg mt-2"
              />
            )}
          </div>

          {/* ====== KODE ====== */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">
              Kode Pengiriman
            </label>
            <select
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            >
              <option value="" disabled hidden></option>
              <option value="JKSOQA">JKSOQA</option>
              <option value="JKSOQB">JKSOQB</option>
              <option value="JPSOQA">JPSOQA</option>
              <option value="JPSOQB">JPSOQB</option>
              <option value="Bermasalah">Bermasalah</option>
            </select>
            {errors.kode && (
              <p className="text-red-500 text-sm">{errors.kode}</p>
            )}
          </div>

          {/* ====== BUTTON ====== */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#3e146d] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputDetailPackageForm;