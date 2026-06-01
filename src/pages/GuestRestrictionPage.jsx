import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn, PackageCheck, Home } from "lucide-react";

export default function GuestRestrictionPage({ from }) {
  const navigate = useNavigate();
  const location = useLocation();
  const loginFrom = from || location.state?.from || location;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-white via-violet-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-[398px] overflow-hidden rounded-[28px] border border-white bg-white shadow-2xl shadow-violet-950/10">
        <div className="relative bg-gradient-to-br from-violet-700 via-fuchsia-600 to-blue-700 px-6 pb-16 pt-8 text-white">
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <img
              src="/images/logo_gex.png"
              alt="GEx"
              className="h-11 w-auto drop-shadow-[0_10px_20px_rgba(49,10,101,0.45)]"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <LockKeyhole className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="relative -mt-10 px-5 pb-6">
          <div className="rounded-[24px] border border-violet-100 bg-white p-5 text-center shadow-xl shadow-violet-950/10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-violet-50 text-violet-700 shadow-inner shadow-white">
              <PackageCheck className="h-10 w-10" />
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-normal text-slate-950">
              Akses Terbatas
            </h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              Silakan masuk ke akun Anda untuk mendapatkan akses penuh ke seluruh layanan dan fitur GEx.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Daftar dan login untuk mengelola paket, melihat riwayat pengiriman, mengakses layanan pelanggan, serta fitur eksklusif lainnya.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => navigate("/login", { state: { from: loginFrom } })}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-700/25 transition active:scale-[0.98]"
              >
                <LogIn className="h-5 w-5" />
                Masuk Sekarang
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition active:scale-[0.98]"
              >
                <Home className="h-5 w-5" />
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
