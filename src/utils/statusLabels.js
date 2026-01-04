export const STATUS_LABELS = {
  1: "Tiba Gudang Tangerang",
  2: "Dipacking",
  3: "Menuju Kota Tujuan",
  4: "Tiba Kota Tujuan",
  5: "Siap Diambil",
  6: "Menunggu Di Pick Up oleh Kurir",
  7: "Dalam Pengantaran",
  8: "Diterima yang Bersangkutan",
};

export const getStatusLabel = (status) =>
  STATUS_LABELS[Number(status)] || "Status tidak dikenal";