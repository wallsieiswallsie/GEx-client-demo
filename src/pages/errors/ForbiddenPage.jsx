import { useNavigate } from "react-router-dom";

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
      <p className="text-gray-600 mb-6">
        Kamu tidak memiliki izin untuk melihat halaman ini.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}

export default ForbiddenPage;