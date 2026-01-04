import { useState } from "react";
import { validateField } from "../utils/validations";
import { createPackageApi } from "../utils/api";
import imageCompression from "browser-image-compression";

export const useInputDetailPackage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    resi: "",
    panjang: "",
    lebar: "",
    tinggi: "",
    berat: "",
    kode: "",
    tanggal_tiba: "",  
    ekspedisi: "",
    foto: null,
    preview: null,
    invoiced: false,
    finished: false,
    via: "Kapal",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // kompres foto sebelum disimpan di state
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1, // target maksimum 1MB
      maxWidthOrHeight: 1280, // ubah ukuran agar lebih kecil
      useWebWorker: true,
    });

    const preview = URL.createObjectURL(compressedFile);
    setFormData((prev) => ({ ...prev, foto: compressedFile, preview }));
  };

  const handleCancel = () => {
    setFormData({
      nama: "",
      resi: "",
      panjang: "",
      lebar: "",
      tinggi: "",
      berat: "",
      kode: "",
      tanggal_tiba: "",
      ekspedisi: "",
      foto: null,
      preview: null,
      invoiced: false,
      finished: false,
      via: "Kapal",
    });
    setErrors({});
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "foto" && key !== "preview") {
        const errorMsg = validateField(key, formData[key]);
        if (errorMsg) newErrors[key] = errorMsg;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = new FormData();
      data.append("nama", formData.nama);
      data.append("resi", formData.resi);
      data.append("panjang", Number(formData.panjang));
      data.append("lebar", Number(formData.lebar));
      data.append("tinggi", Number(formData.tinggi));
      data.append("berat", Number(formData.berat));
      data.append("kode", formData.kode);
      data.append("via", formData.via);
      data.append("invoiced", formData.invoiced);
      data.append("finished", formData.finished);
      data.append("tanggal_tiba", formData.tanggal_tiba || "");
      data.append("ekspedisi", formData.ekspedisi || "");
      if (formData.foto) data.append("photo", formData.foto);

      await createPackageApi(data); // kirim sebagai multipart form-data
      alert("Data berhasil disimpan!");
      handleCancel();
    } catch (err) {
      alert("Gagal simpan: " + err.message);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSave,
    handleCancel,
    handleFileChange,
  };
};