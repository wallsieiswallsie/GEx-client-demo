import { useNavigate } from "react-router-dom";

export default function ManageCustomerService() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Syarat & Ketentuan",
      description: "Lihat detail syarat dan ketentuan layanan.",
      path: "/syarat-ketentuan",
    },
    {
      title: "Jadwal Kirim",
      description: "Lihat jadwal terdekat.",
      path: "/jadwal_kirim",
    },
    {
      title: "Lokasi & Kontak",
      description: "Lihat Lokasi Cabang & Kontak.",
      path: "/lokasi-kontak",
    },
    {
      title: "Sering Ditanyakan",
      description: "Kelola pertanyaan.",
      path: "/sering_ditanyakan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f4e9ff] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border border-[#3e146d]/10">

        <h2 className="text-3xl font-bold text-center text-[#3e146d] mb-6">
          Customer Service
        </h2>

        <div className="flex flex-col gap-4">
          {services.map((svc, index) => (
            <div
              key={index}
              className="p-4 bg-[#3e146d] text-white rounded-xl shadow-md cursor-pointer 
                         hover:opacity-90 transition border border-[#3e146d]/20"
              onClick={() => navigate(svc.path)}
            >
              <p className="text-lg font-semibold">{svc.title}</p>
              <p className="text-sm opacity-90 mt-1">{svc.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}