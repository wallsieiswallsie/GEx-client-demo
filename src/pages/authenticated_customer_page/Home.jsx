import { Search, Package, Map, Box, Store, Handshake, DollarSign, Video, HelpCircle, Ship } from "lucide-react";
import {
  Clock,
  XCircle,
  Warehouse,
  Box,
  Truck,
  MapPin,
  CheckCircle,
} from "lucide-react";


export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen pb-6">
      {/* HEADER */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
          K
        </div>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Lacak paket..."
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm outline-none"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="text-gray-500 text-xl">↗</div>
      </div>

      {/* PROMO CARD */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="promo"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-end text-white">
            <h2 className="font-bold text-lg">Promo Spesial</h2>
            <p className="text-sm">Diskon pengiriman ke seluruh Indonesia!</p>
          </div>
        </div>

        {/* DOT */}
        <div className="flex justify-center mt-2 gap-2">
          <div className="w-4 h-1 rounded bg-blue-600"></div>
          <div className="w-2 h-1 rounded bg-gray-300"></div>
        </div>
      </div>

      {/* STATUS */}
        <div className="px-4 mt-4">
        <h3 className="font-semibold mb-2">Status Paketmu</h3>

        <div className="flex gap-3 overflow-x-auto pb-2">
            <StatusCard title="Menunggu Tiba" value="0" icon="clock" />
            <StatusCard title="Tidak Valid" value="0" icon="x-circle" danger />
            <StatusCard title="Tiba Gudang" value="0" icon="warehouse" highlight />
            <StatusCard title="Dipacking" value="0" icon="box" />
            <StatusCard title="Dalam Pengiriman" value="0" icon="truck" />
            <StatusCard title="Tiba Tujuan" value="0" icon="map-pin" />
            <StatusCard title="Siap Diambil" value="0" icon="box-check" />
            <StatusCard title="Selesai" value="0" icon="check-circle" highlight />
        </div>
        </div>

      {/* JADWAL KAPAL */}
      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Jadwal Kapal</h3>
          <span className="text-blue-600 text-sm cursor-pointer">
            Lihat Semua →
          </span>
        </div>

        <div className="bg-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <Ship size={16} />
            KM. Dorolonda
          </div>
          <p className="text-sm text-gray-600">Closing: 20/3/2026</p>

          <div className="flex justify-between mt-3 text-sm">
            <div>
              <p className="text-gray-500">Asal</p>
              <p className="font-semibold">Jakarta</p>
            </div>

            <div className="flex items-center">→</div>

            <div>
              <p className="text-gray-500">Tujuan</p>
              <p className="font-semibold">Makassar</p>
            </div>
          </div>
        </div>
      </div>

      {/* LAYANAN */}
      <div className="px-4 mt-4">
        <h3 className="font-semibold mb-2">Layanan</h3>

        <div className="grid grid-cols-4 gap-4">
          <Menu icon={<Search />} label="Cek Ongkir" />
          <Menu icon={<Map />} label="Lacak Paket" />
          <Menu icon={<Box />} label="Daftarkan Paket" />
          <Menu icon={<Store />} label="Lokasi Gerai" />
          <Menu icon={<Handshake />} label="Kemitraan" />
          <Menu icon={<DollarSign />} label="COD" />
          <Menu icon={<Video />} label="Unboxing" />
          <Menu icon={<HelpCircle />} label="Bantuan" />
          <Menu icon={<Ship />} label="Jadwal Kapal" />
        </div>
      </div>

      {/* BERITA */}
      <div className="px-4 mt-4">
        <h3 className="font-semibold mb-2">Berita</h3>

        <div className="flex gap-3 overflow-x-auto">
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function StatusCard({ title, value, icon, danger, highlight }) {
  const getIcon = () => {
    switch (icon) {
      case "clock":
        return <Clock size={18} />;
      case "x-circle":
        return <XCircle size={18} />;
      case "warehouse":
        return <Warehouse size={18} />;
      case "box":
        return <Box size={18} />;
      case "truck":
        return <Truck size={18} />;
      case "map-pin":
        return <MapPin size={18} />;
      case "check-circle":
        return <CheckCircle size={18} />;
      case "box-check":
        return (
          <div className="relative">
            <Box size={18} />
            <CheckCircle
              size={10}
              className="absolute -bottom-1 -right-1 bg-white rounded-full"
            />
          </div>
        );
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className="min-w-[110px] bg-white rounded-xl p-3 shadow-sm text-center flex-shrink-0">
      <div
        className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center mb-1
        ${danger ? "bg-red-100 text-red-500" : ""}
        ${highlight ? "bg-green-100 text-green-600" : ""}
        ${!danger && !highlight ? "bg-gray-100 text-gray-600" : ""}`}
      >
        {getIcon()}
      </div>

      <p className="font-bold">{value}</p>
      <p className="text-xs text-gray-500">{title}</p>
    </div>
  );
}

function Menu({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center text-orange-500">
        {icon}
      </div>
      <p className="text-xs">{label}</p>
    </div>
  );
}

function NewsCard() {
  return (
    <div className="min-w-[220px] bg-white rounded-xl overflow-hidden shadow-sm">
      <img
        src="https://via.placeholder.com/300x150"
        alt="news"
        className="w-full h-28 object-cover"
      />
      <div className="p-2 text-sm font-medium">
        Alur Pengiriman GEx
      </div>
    </div>
  );
}