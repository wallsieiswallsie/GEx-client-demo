import { ArrowLeft, Clock, XCircle, Package, Box, Truck, Calendar } from "lucide-react";

function StatusCard({ icon, count, label, active }) {
  return (
    <div
      className={`flex flex-col items-start p-3 rounded-xl border w-full ${
        active ? "bg-red-50 border-red-200" : "bg-white"
      }`}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{count}</h3>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function PackageCard({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-lg">
            <Package className="text-red-500" size={20} />
          </div>
          <div>
            <h2 className="font-semibold">{data.code}</h2>
            <p className="text-sm text-gray-500">Paket</p>
          </div>
        </div>

        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          Menunggu Tiba
        </span>
      </div>

      <div className="mt-4 text-sm">
        <p className="text-gray-500">Pengirim: Unknown Sender</p>
        <p className="font-medium mb-2">Asal</p>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div>
            <p className="text-gray-500">Penerima: {data.receiver}</p>
            <p className="font-medium">Unknown Destination</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={16} />
          <span>{data.date}</span>
        </div>

        <div className="flex gap-4">
          <button className="text-blue-500">Edit Paket</button>
          <button className="text-red-500 flex items-center gap-1">
            Lacak Detail →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClaimedPackages() {
  const dummyData = [
    {
      code: "ZZZZ123",
      receiver: "PAKETKU",
      date: "1 Apr 2026",
    },
    {
      code: "GEX1010",
      receiver: "CUSTOMER TES INPUT PAKET",
      date: "26 Mar 2026",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 bg-white shadow-sm">
        <ArrowLeft />
        <h1 className="text-lg font-semibold">Daftarkan Paketmu</h1>
      </div>

      {/* INPUT */}
      <div className="p-4">
        <p className="text-sm mb-2">Masukkan nomor resi paketmu:</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="CONTOH: GEX123456789"
            className="flex-1 border rounded-xl px-3 py-2 outline-none"
          />
          <button className="bg-red-500 text-white px-4 rounded-xl">
            Daftar
          </button>
        </div>
      </div>

      {/* STATUS */}
      <div className="px-4 grid grid-cols-4 gap-3">
        <StatusCard
          icon={<Clock size={18} />}
          count={2}
          label="Menunggu Tiba"
          active
        />
        <StatusCard
          icon={<XCircle size={18} />}
          count={0}
          label="Tidak Valid"
        />
        <StatusCard
          icon={<Package size={18} />}
          count={0}
          label="Tiba Gudang"
        />
        <StatusCard
          icon={<Box size={18} />}
          count={1}
          label="Dipacking"
        />
      </div>

      {/* ALERT */}
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} />
            <p className="font-semibold">Perhatian</p>
          </div>
          <p className="text-sm text-gray-600">
            Pantau status paketmu. Jika dalam 7 hari sejak diinput belum berstatus
            Tiba Gudang, paket akan menjadi Tidak Valid dan terhapus 7 hari
            kemudian.
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="px-4 pb-6">
        {dummyData.map((item, index) => (
          <PackageCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
}