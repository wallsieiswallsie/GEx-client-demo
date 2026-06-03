import React, { useState } from 'react';
import {
  ArrowRight,
  LockKeyhole,
  Phone,
  Sparkles,
  User,
  UserRoundPlus,
} from 'lucide-react';
import InputField from '../components/common/InputField';
import OtpModal from '../components/auth/OtpModal';
import { authApi } from '../services/api/authApi';
import { useAuth } from '../context/useAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', username: '', whatsapp_number: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const { login } = useAuth();

  const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WA || "6281234567890"; // Ganti default dengan no sebenarnya

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.requestOtp({
        username: formData.username,
        whatsapp_number: formData.whatsapp_number,
      });
      // Di klien kita tak perlu peduli berhasil dikirim via WA Provider / Error. 
      // Kalau berhasil ke generate, kita asumsikan server sedang Push, dan kita Pop Window:
      if (res.status === 'success') {
        const pesanTrigger = encodeURIComponent(`Halo admin GEX, saya ingin mendaftar dan memicu pengiriman kode akses OTP untuk akun saya.`);
        const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${pesanTrigger}`;
        window.open(waUrl, '_blank'); // Buka link WA otomatis

        setShowOtpModal(true);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat meminta OTP. Pastikan backend hidup.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authApi.requestOtp({
        username: formData.username,
        whatsapp_number: formData.whatsapp_number,
      });
      const pesanTrigger = encodeURIComponent(`Halo admin GEX, mohon kirim ulang kode akses OTP saya.`);
      window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${pesanTrigger}`, '_blank');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan resend OTP.');
    }
  };

  const handleVerifyOtp = async (otp) => {
    setLoading(true);
    try {
      const res = await authApi.register({ ...formData, otp });
      if (res.status === 'success') {
        login(res.data.user, res.data.accessToken, res.data.refreshToken);
        window.location.href = '/dashboard';
      } else {
        setError(res.message);
        setShowOtpModal(false);
      }
    } catch (err) {
      setError(err.message || 'Server error saat verifikasi OTP.');
      setShowOtpModal(false);
    } finally {
       setLoading(false);
    }
  };

  const handleChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const inputAccentClasses = {
    labelClassName: 'font-bold text-slate-900',
    inputClassName:
      'h-14 rounded-2xl border-slate-200 bg-slate-50/80 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 shadow-inner shadow-slate-100/70 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/15',
    iconClassName: 'text-violet-600',
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[24rem] overflow-hidden rounded-[2rem] bg-slate-50 text-slate-950 shadow-2xl shadow-violet-950/10 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] lg:rounded-[2.25rem]">

        {/* HEADER */}
        <div
          className="relative min-h-[16.5rem] overflow-hidden bg-cover bg-center bg-no-repeat px-7 pb-20 pt-10 text-white sm:px-8 lg:flex lg:min-h-[700px] lg:items-center lg:px-10 lg:pb-10 lg:pt-10"
          style={{ backgroundImage: "url('/images/header_background/login.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/85 via-violet-800/65 to-indigo-950/45" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />
          <div className="relative mx-auto flex max-w-xs flex-col items-center text-center lg:max-w-sm">
            <img
              src="/images/logo_gex.png"
              alt="GEx"
              className="mb-5 h-16 w-auto drop-shadow-[0_12px_24px_rgba(49,10,101,0.55)]"
            />
            <h1 className="text-[1.9rem] font-black leading-tight tracking-normal text-white drop-shadow-sm lg:text-4xl">
              Buat akun baru
            </h1>
            <p className="mt-3 max-w-[17rem] text-sm font-medium leading-6 text-white/85 lg:max-w-xs lg:text-base lg:leading-7">
              Mulai pengalaman pengiriman yang lebih cepat dan aman bersama GEx.
            </p>
          </div>
        </div>

        <div className="relative z-10 -mt-14 px-4 pb-5 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:px-8 lg:py-8">
          <div className="animate-[fadeIn_0.35s_ease-out] rounded-[1.75rem] border border-white/80 bg-white p-6 shadow-2xl shadow-violet-950/10 sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 shadow-inner shadow-white">
                <UserRoundPlus className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="min-w-0 pt-1">
                <h2 className="text-xl font-black leading-tight text-slate-950">
                  Daftar Akun GEx
                </h2>
                <p className="mt-1 text-sm font-medium leading-5 text-slate-500">
                  Lengkapi identitas Anda di bawah ini.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
              <InputField
                label="Nama Lengkap"
                value={formData.name}
                onChange={(e) => handleChange(e, 'name')}
                placeholder="Cth: Budi Santoso"
                icon={UserRoundPlus}
                required
                {...inputAccentClasses}
              />
              <InputField
                label="Username"
                value={formData.username}
                onChange={(e) => handleChange(e, 'username')}
                placeholder="Cth: budi123"
                icon={User}
                required
                {...inputAccentClasses}
              />
              <InputField
                label="No WhatsApp Aktif"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange(e, 'whatsapp_number')}
                placeholder="Cth: 0812345678"
                inputMode="tel"
                autoComplete="tel"
                icon={Phone}
                required
                {...inputAccentClasses}
              />
              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange(e, 'password')}
                placeholder="Buat sandi yang aman"
                autoComplete="new-password"
                icon={LockKeyhole}
                required
                {...inputAccentClasses}
              />

              <div className="pt-3 lg:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-red-500 via-fuchsia-600 to-blue-700 px-5 text-base font-black text-white shadow-xl shadow-fuchsia-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-fuchsia-700/30 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span>{loading ? 'Sabar, sedang sinkronisasi...' : 'Daftar Sekarang'}</span>
                  {!loading && (
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-xl shadow-violet-950/10 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-950">
                  Punya akun?
                </p>
                <p className="text-xs font-medium leading-5 text-slate-500">
                  Masuk dan lanjutkan pengiriman Anda.
                </p>
              </div>
              <a
                href="/login"
                className="shrink-0 rounded-full border border-violet-600 px-4 py-2 text-sm font-black text-violet-700 transition-all duration-300 hover:bg-violet-50 hover:shadow-lg hover:shadow-violet-700/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        whatsappNumber={formData.whatsapp_number}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </>
  );
}
