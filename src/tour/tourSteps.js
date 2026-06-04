export const TOUR_SEEN_KEY = "gex_has_seen_tour";
export const TOUR_PROGRESS_KEY = "gex_tour_progress";

const CUSTOMER_STEPS = [
  {
    target: "[data-tour='app-header']",
    title: "Beranda GEx",
    content: "Ini adalah beranda utama GEx. Dari sini Anda dapat mengakses seluruh layanan pelanggan.",
    path: "/home",
  },
  {
    target: "[data-tour='customer-menu-cek-ongkir']",
    title: "Cek Ongkir",
    content: "Gunakan fitur ini untuk memperkirakan biaya pengiriman.",
    path: "/home",
  },
  {
    target: "[data-tour='customer-menu-lacak-paket']",
    title: "Lacak Paket",
    content: "Gunakan nomor resi untuk mengetahui posisi paket secara real-time.",
    path: "/home",
  },
  {
    target: "[data-tour='customer-menu-daftar-paket']",
    title: "Daftarkan Paket",
    content: "Klik menu Daftarkan Paket untuk mulai mendaftarkan paket yang akan dikirim ke gudang GEx.",
    path: "/home",
    waitForPath: "/daftar-paket",
  },
  {
    target: "[data-tour='package-registration-form']",
    title: "Isi Form Paket",
    content: "Lengkapi data paket, rute, dan detail barang. Tour akan tetap tersimpan sementara saat Anda berpindah halaman.",
    path: "/daftar-paket",
  },
  {
    target: "[data-tour='customer-menu-jadwal-kapal']",
    title: "Jadwal Kapal",
    content: "Lihat jadwal keberangkatan kapal yang tersedia.",
    path: "/home",
  },
  {
    target: "[data-tour='customer-menu-lokasi-gerai']",
    title: "Lokasi Gerai",
    content: "Temukan gerai GEx terdekat.",
    path: "/home",
  },
  {
    target: "[data-tour='bottom-navigation']",
    title: "Navigasi Bawah",
    content: "Gunakan navigasi ini untuk berpindah antar halaman.",
    path: "/home",
  },
];

const GENERAL_MANAGER_STEPS = [
  ["gm-operational-summary", "Ringkasan Jumlah User", "Bagian ini menampilkan jumlah user yang terdaftar."],
  ["gm-total-package", "Total Customer Terdaftar", "Pantau jumlah customer yang telah mendaftar."],
  ["gm-total-invoice", "Total Non-Customer", "Lihat jumlah user non-customer yang terdaftar."],
  ["gm-total-batch", "Batch Kapal Terdekat", "Pantau batch kapal atau pesawat yang sedang berjalan."],
  ["gm-shipping-value", "Paket belum dipacking", "Bagian ini membantu melihat paket yang belum dipacking."],
  ["gm-menu-operational", "Menu Operasional", "Masuk ke modul operasional untuk melihat paket, packing, batch, dan status pengiriman."],
  ["gm-menu-finance", "Menu Keuangan", "Gunakan menu ini untuk memantau pembayaran dan arus kas."],
  ["gm-menu-report", "Saran & Masukan", "Menampung saran dan masukan dari customer."],
].map(([target, title, content]) => ({
  target: `[data-tour='${target}']`,
  title,
  content,
  path: "/home",
}));

const BRANCH_MANAGER_STEPS = [
  ["bm-package-monitoring", "Monitoring Paket Cabang", "Pantau paket yang berada dalam tanggung jawab cabang."],
  ["bm-batch-monitoring", "Monitoring Batch", "Lihat batch yang berkaitan dengan cabang saat ini."],
  ["bm-shipment-monitoring", "Monitoring Pengiriman", "Pantau pengiriman yang sedang berjalan menuju atau dari cabang."],
  ["bm-branch-report", "Laporan Cabang", "Gunakan laporan cabang untuk evaluasi operasional setempat."],
  ["bm-branch-filter", "Filter Cabang", "Filter cabang membantu melihat data sesuai area kerja yang dipilih."],
].map(([target, title, content]) => ({
  target: `[data-tour='${target}']`,
  title,
  content,
  path: "/home",
}));

const ORIGIN_STEPS = [
  {
    target: "[data-tour='origin-input-package']",
    title: "Input Paket Baru",
    content: "Klik tombol tambah untuk membuka form input paket baru.",
    path: "/input",
    waitForTarget: "[data-tour='package-modal']",
  },
  {
    target: "[data-tour='package-modal']",
    title: "Isi Form Paket",
    content: "Isi informasi paket, ekspedisi, berat, dimensi, rute, dan barang.",
    path: "/input",
  },
  {
    target: "[data-tour='origin-package-list']",
    title: "Daftar Paket",
    content: "Daftar ini menampilkan paket yang sudah masuk ke gudang asal.",
    path: "/input",
  },
  {
    target: "[data-tour='origin-packing-process']",
    title: "Proses Packing",
    content: "Paket yang belum dipacking dapat diproses ke karung atau batch.",
    path: "/belum-packing",
  },
  {
    target: "[data-tour='origin-batch-create']",
    title: "Pembuatan Batch",
    content: "Buat batch kapal atau pesawat untuk mengelompokkan pengiriman.",
    path: "/kloter",
  },
  {
    target: "[data-tour='origin-xray-failed']",
    title: "Paket Tidak Lolos X-Ray",
    content: "Catat paket yang tidak lolos X-Ray agar rute dan biayanya bisa diproses ulang.",
    path: "/xray-failed-packages",
  },
  {
    target: "[data-tour='bottom-navigation']",
    title: "Status Pengiriman",
    content: "Gunakan navigasi dan modul operasional untuk mengikuti perubahan status pengiriman.",
    path: "/home",
  },
];

const DESTINATION_STEPS = [
  ["destination-batch-receive", "Penerimaan Batch", "Mulai dari penerimaan batch yang tiba di gudang tujuan."],
  ["destination-sack-receive", "Penerimaan Karung", "Karung dalam batch divalidasi sebelum paket diproses lebih lanjut."],
  ["destination-package-validation", "Validasi Paket", "Validasi memastikan paket sesuai dengan data pengiriman."],
  ["destination-status-update", "Update Status Paket", "Perbarui status paket agar customer dapat melacaknya."],
  ["destination-pickup-preparation", "Persiapan Pengambilan", "Siapkan paket yang akan diambil sendiri oleh customer."],
  ["destination-delivery-preparation", "Persiapan Pengantaran", "Siapkan paket yang akan diantar oleh kurir."],
].map(([target, title, content]) => ({
  target: `[data-tour='${target}']`,
  title,
  content,
  path: "/home",
}));

export function getTourSteps(roleKey, authRole) {
  if (roleKey === "customer" || authRole === "customer") return CUSTOMER_STEPS;
  if (roleKey === "general_manager" || authRole === "general_manager") return GENERAL_MANAGER_STEPS;
  if (roleKey === "branch_manager" || authRole === "branch_manager") return BRANCH_MANAGER_STEPS;
  if (roleKey === "branch_staff_origin") return ORIGIN_STEPS;
  if (roleKey === "branch_staff_destination") return DESTINATION_STEPS;
  if (authRole === "branch_staff") return ORIGIN_STEPS;
  return CUSTOMER_STEPS;
}
