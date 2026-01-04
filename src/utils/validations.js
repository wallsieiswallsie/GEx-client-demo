export const validateField = (name, value) => {
  let message = "";

  if (name === "nama") {
    if (!value.trim()) message = "Nama wajib diisi";
    else if (value.length < 3) message = "Nama minimal 3 karakter";
  }

  if (name === "resi") {
    if (!value.trim()) message = "Resi wajib diisi";
  }

  if (["panjang", "lebar", "tinggi", "berat"].includes(name)) {
    if (!value) message = `${name} wajib diisi`;
    else if (isNaN(value) || Number(value) <= 0)
      message = `${name} harus angka > 0`;
  }

  if (name === "kode") {
    if (!value.trim()) message = "Kode pengiriman wajib diisi";
  }

  return message;
};