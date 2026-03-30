import React, { useRef, useState, useEffect } from "react";
import {
  Package,
  Hash,
  Calendar,
  Truck,
  Weight,
  Ruler,
  Image as ImageIcon,
  Camera,
  Upload,
  ScanLine,
} from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

function InputDetailPackageForm({
  formData,
  errors,
  handleChange,
  handleSave,
  handleCancel,
  handleFileChange,
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const resiInputRef = useRef(null);
  const videoRef = useRef(null);

  const [statusPaket, setStatusPaket] = useState("Sesuai");
  const [showScanner, setShowScanner] = useState(false);

  // AUTO SET KODE
  useEffect(() => {
    if (statusPaket === "Bermasalah") {
      handleChange({
        target: { name: "kode", value: "Bermasalah" },
      });
    } else {
      handleChange({
        target: { name: "kode", value: "" },
      });
    }
  }, [statusPaket]);

  // ZXING SCANNER
  useEffect(() => {
    if (!showScanner) return;

    const codeReader = new BrowserMultiFormatReader();

    const constraints = {
      video: {
        facingMode: { ideal: "environment" }, // kamera belakang
      },
    };

    codeReader
      .decodeFromConstraints(constraints, videoRef.current, (result, err) => {
        if (result) {
          const text = result.getText();

          // ✅ isi ke input
          handleChange({
            target: { name: "resi", value: text },
          });

          // ✅ stop scanner
          codeReader.reset();
          setShowScanner(false);

          // ✅ fokus balik ke input
          setTimeout(() => {
            resiInputRef.current?.focus();
          }, 200);
        }
      })
      .catch((err) => {
        console.error("Scanner error:", err);
      });

    return () => {
      codeReader.reset();
    };
  }, [showScanner]);

  const onSave = async (e) => {
    e.preventDefault();

    if (!formData.ekspedisi) return alert("Pilih ekspedisi!");
    if (!formData.tanggal_tiba) return alert("Isi tanggal!");
    if (!formData.preview) return alert("Upload foto!");
    if (!formData.nama) return alert("Isi nama!");
    if (!formData.panjang) return alert("Isi panjang!");
    if (!formData.lebar) return alert("Isi lebar!");
    if (!formData.tinggi) return alert("Isi tinggi!");
    if (!formData.berat) return alert("Isi berat!");
    if (!formData.kode) return alert("Kode kosong!");

    await handleSave(e);

    if (fileInputRef.current) fileInputRef.current.value = null;
    if (cameraInputRef.current) cameraInputRef.current.value = null;
  };

  const ekspedisiOptions = [
    "J&T Express",
    "Shopee Express",
    "JNE",
    "LEX",
    "POS",
    "TIKI",
    "Wahana",
    "Indah Cargo",
    "SiCepat",
    "Anteraja",
    "SAPX",
    "Grab",
    "Gojek",
    "Lainnya",
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-5">

        <h1 className="text-lg font-semibold mb-4">
          Input Paket Gudang Asal
        </h1>

        {/* STATUS */}
        <div className="mb-4">
          <p className="text-sm mb-2 font-medium">Status Paket</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatusPaket("Sesuai")}
              className={`flex-1 py-2 rounded-xl border ${
                statusPaket === "Sesuai"
                  ? "bg-green-100 border-green-500 text-green-700"
                  : ""
              }`}
            >
              Sesuai
            </button>

            <button
              type="button"
              onClick={() => setStatusPaket("Bermasalah")}
              className={`flex-1 py-2 rounded-xl border ${
                statusPaket === "Bermasalah"
                  ? "bg-gray-200 border-gray-500"
                  : ""
              }`}
            >
              Bermasalah
            </button>
          </div>
        </div>

        <form onSubmit={onSave} className="flex flex-col gap-4">

          {/* RESI */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Hash size={16} /> Nomor Resi
            </label>

            <div className="flex gap-2">
              <input
                ref={resiInputRef}
                type="text"
                name="resi"
                value={formData.resi}
                onChange={handleChange}
                placeholder="Scan / input manual"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="mt-1 px-3 bg-purple-600 text-white rounded-lg"
              >
                <ScanLine size={18} />
              </button>
            </div>
          </div>

          {/* NAMA */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Package size={16} /> Nama Paket
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* KODE */}
          {statusPaket === "Sesuai" && (
            <div>
              <label className="text-sm font-medium">Kode Rute</label>
              <select
                name="kode"
                value={formData.kode}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              >
                <option value="">Pilih Kode</option>
                <option value="JKSOQA">JKSOQA</option>
                <option value="JKSOQB">JKSOQB</option>
                <option value="JPSOQA">JPSOQA</option>
                <option value="JPSOQB">JPSOQB</option>
              </select>
            </div>
          )}

          {/* FOTO */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon size={16} /> Foto Paket
            </label>

            <div className="border-2 border-dashed rounded-xl p-6 text-center text-gray-400">
              PNG, JPG, GIF up to 10MB
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />

              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                onChange={handleFileChange}
                hidden
              />

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Upload size={16} /> Upload File
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current.click()}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Camera size={16} /> Ambil Foto
              </button>
            </div>

            {formData.preview && (
              <img
                src={formData.preview}
                className="mt-2 w-full rounded-lg"
              />
            )}
          </div>

          {/* TANGGAL */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar size={16} /> Tanggal Tiba Gudang
            </label>
            <input
              type="date"
              name="tanggal_tiba"
              value={formData.tanggal_tiba}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* EKSPEDISI */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Truck size={16} /> Ekspedisi
            </label>
            <select
              name="ekspedisi"
              value={formData.ekspedisi}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
              <option value="">Pilih Ekspedisi</option>
              {ekspedisiOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* BERAT */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Weight size={16} /> Berat (Kg)
            </label>
            <input
              type="number"
              name="berat"
              value={formData.berat}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* DIMENSI */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Ruler size={16} /> Dimensi Paket (cm)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input name="panjang" value={formData.panjang} onChange={handleChange} placeholder="Panjang" className="border p-2 rounded-lg"/>
              <input name="lebar" value={formData.lebar} onChange={handleChange} placeholder="Lebar" className="border p-2 rounded-lg"/>
              <input name="tinggi" value={formData.tinggi} onChange={handleChange} placeholder="Tinggi" className="border p-2 rounded-lg"/>
            </div>
          </div>

          <button className="mt-4 bg-red-600 text-white py-3 rounded-xl">
            Submit Data Paket
          </button>
        </form>
      </div>

      {/* SCANNER */}
      {showScanner && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="p-4 text-white">Scan Resi</div>

          <div className="flex-1 relative">
            <video ref={videoRef} className="w-full h-full object-cover" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-40 border-2 border-red-500 rounded-lg relative overflow-hidden">
                <div className="absolute w-full h-[2px] bg-orange-400 animate-pulse top-1/2" />
              </div>
            </div>

            <p className="absolute bottom-10 w-full text-center text-white text-sm">
              Scan the waybill barcode
            </p>
          </div>

          <button
            onClick={() => setShowScanner(false)}
            className="p-4 bg-red-600 text-white"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}

export default InputDetailPackageForm;