const fallbackOrigin = typeof window !== "undefined" ? window.location.origin : "";

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || fallbackOrigin).replace(/\/+$/, "");

export const DEFAULT_SEO = {
  title: "Pengiriman Mudah & Murah",
  description:
    "Cek ongkir, lacak paket, dan kirim barang ke Sorong Papua dengan GEx. Layanan pengiriman mudah, transparan, dan terpercaya.",
  robots: "index,follow",
  image: "/images/og-image.png",
  type: "website",
  siteName: "GEx",
  twitterCard: "summary_large_image",
};

export const PUBLIC_SEO = {
  home: {
    title: "Pengiriman Mudah & Murah",
    description:
      "Cek ongkir, lacak paket, dan kirim barang ke Sorong Papua dengan GEx. Layanan pengiriman mudah, transparan, dan terpercaya.",
    path: "/home",
  },
  shippingRate: {
    title: "Cek Ongkir Pengiriman Barang ke Sorong | GEx",
    description:
      "Cek estimasi ongkir pengiriman barang ke Sorong Papua secara mudah dan cepat melalui GEx Express.",
    path: "/cek-ongkir",
  },
  tracking: {
    title: "Lacak Paket Pengiriman | GEx",
    description:
      "Lacak status pengiriman paket GEx Express menggunakan nomor resi dengan mudah dan cepat.",
    path: "/lacak",
  },
  shipSchedule: {
    title: "Jadwal Kapal Pengiriman Barang ke Sorong | GEx",
    description:
      "Lihat jadwal kapal terdekat untuk pengiriman barang ke Sorong Papua bersama GEx Express.",
    path: "/jadwal",
  },
  branches: {
    title: "Lokasi Gerai GEx Express",
    description:
      "Temukan lokasi gerai GEx Express terdekat untuk kebutuhan pengiriman barang Anda.",
    path: "/gerai",
  },
  partnership: {
    title: "Kemitraan GEx",
    description:
      "Dapatkan informasi program kemitraan GEx Express untuk berkembang bersama layanan pengiriman terpercaya.",
    path: "/kemitraan",
  },
  help: {
    title: "Bantuan dan FAQ | GEx",
    description:
      "Temukan jawaban atas pertanyaan umum seputar layanan, tarif, pengiriman, dan paket di GEx Express.",
    path: "/bantuan",
  },
  feedback: {
    title: "Saran dan Masukan | GEx",
    description:
      "Sampaikan saran, kritik, dan masukan untuk membantu GEx Express meningkatkan kualitas layanan pengiriman.",
    path: "/saran-masukan",
  },
  registerPackage: {
    title: "Daftarkan Paket | GEx",
    description:
      "Daftarkan nomor resi paket Anda agar status pengiriman lebih mudah dipantau melalui GEx Express.",
    path: "/daftar-paket",
  },
  content: {
    title: "Info dan Berita GEx",
    description:
      "Baca informasi terbaru seputar layanan, pengiriman, dan aktivitas GEx Express.",
    path: "/konten",
  },
  helpCategory: {
    title: "Kategori Bantuan | GEx ",
    description:
      "Telusuri kategori bantuan GEx untuk menemukan jawaban yang sesuai dengan kebutuhan pengiriman Anda.",
    path: "/help/category",
  },
  helpDetail: {
    title: "Detail Bantuan | GEx",
    description:
      "Baca jawaban bantuan GEx seputar layanan, tarif, pengiriman, dan paket.",
    path: "/bantuan",
  },
};

export const PUBLIC_SITEMAP_ROUTES = [
  PUBLIC_SEO.tracking,
];

export const ROBOTS_DISALLOW_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/home",
  "/beranda",
  "/dashboard",
  "/operasional",
  "/logistik",
  "/keuangan",
  "/payment-methods",
  "/cash-settlements",
  "/invoice",
  "/relasi",
  "/konten-customer",
  "/internal",
  "/feedbacks",
  "/ekspedisi",
  "/item-categories",
  "/gudang",
  "/via",
  "/rute",
  "/input",
  "/packages",
  "/belum-packing",
  "/kloter",
  "/mispacked-packages",
  "/problematic-confirmations",
  "/xray-failed-packages",
  "/users-internal",
  "/users-internal-form",
  "/kontak-customer",
  "/paketku",
  "/profil",
  "/daftar-paket",
  "/cek-ongkir",
  "/jadwal",
  "/gerai",
  "/kemitraan",
  "/konten",
  "/bantuan",
  "/help/category",
  "/saran-masukan",
];

export const NOINDEX_ROBOTS = "noindex,nofollow";
