export const DEMO_GUIDE = {
  customer: [
    "Coba lacak resi DEMO-JX-001 di menu Lacak Paket.",
    "Buka Paketku untuk melihat status paket dari tiba gudang sampai diterima.",
    "Cek ongkir Bekasi ke Sorong dan lihat jadwal kapal aktif.",
  ],
  general_manager: [
    "Lihat dashboard ringkasan performa seluruh cabang.",
    "Masuk ke Invoice untuk melihat nilai pengiriman per batch.",
    "Coba filter cabang Remu untuk membaca performa destination.",
  ],
  branch_manager: [
    "Pantau operasional cabang Remu dari dashboard.",
    "Buka Invoice dan Keuangan untuk melihat paket siap diambil dan setoran.",
    "Periksa data batch yang sudah tiba di kota tujuan.",
  ],
  branch_staff_origin: [
    "Buka Database/Input untuk melihat paket masuk origin.",
    "Cek menu Belum Packing, Kloter, Karung, dan Gagal X-Ray.",
    "Gunakan resi DEMO-JX-002 atau DEMO-JX-008 sebagai contoh paket operasional.",
  ],
  branch_staff_destination: [
    "Lihat paket yang tiba di kota tujuan dan siap diproses.",
    "Buka Invoice untuk paket siap diambil atau pengantaran.",
    "Gunakan resi DEMO-JX-005 dan DEMO-JX-006 sebagai contoh destination flow.",
  ],
};

export const DEMO_FLOW_STEPS = [
  "Paket masuk ke gudang origin.",
  "Staff origin mencatat paket, mengatur batch atau karung, lalu update status.",
  "Pengiriman berjalan dari origin ke destination memakai kapal atau pesawat.",
  "Staff destination menerima paket dan mengatur pengambilan atau pengantaran.",
  "Customer melacak status, melihat paketnya, cek ongkir, dan membaca jadwal kapal.",
  "Branch Manager dan General Manager mengawasi operasional, cabang, batch, invoice, dan nilai pengiriman.",
];
