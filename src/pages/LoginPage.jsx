import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowRight,
  LockKeyhole,
  Phone,
  ShieldCheck,
  User,
  UserRoundPlus,
} from 'lucide-react';
import InputField from '../components/common/InputField';
import { authApi } from '../services/api/authApi';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState('username');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage] = useState(location.state?.message || '');

  const { login } = useAuth();

  // redirect ke halaman sebelumnya atau default
  const from = location.state?.from?.pathname || '/home';

  const handleLogin = async (e) => {
    e.preventDefault();
    const normalizedIdentifier = identifier.trim();
    const phoneNumber = normalizedIdentifier.replace(/\D/g, '');

    if (!normalizedIdentifier) {
      setError(loginMode === 'phone' ? 'Nomor HP wajib diisi.' : 'Username wajib diisi.');
      return;
    }

    if (loginMode === 'phone' && !/^\d{10,15}$/.test(phoneNumber)) {
      setError('Nomor HP harus berupa angka 10-15 digit.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(loginMode === 'phone' ? phoneNumber : normalizedIdentifier, password);

      if (res.status === 'success') {
        const { user, accessToken, refreshToken } = res.data;

        login(user, accessToken, refreshToken);

        // redirect
        navigate(from, { replace: true });

      } else {
        setError(res.message);
      }

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan tidak terduga pada server.');
    } finally {
      setLoading(false);
    }
  };

  const inputAccentClasses = {
    labelClassName: 'font-bold text-slate-900',
    inputClassName:
      'h-14 rounded-2xl border-slate-200 bg-slate-50/80 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 shadow-inner shadow-slate-100/70 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/15',
    iconClassName: 'text-violet-600',
  };

  return (
    <div className="mx-auto w-full max-w-[24rem] overflow-hidden rounded-[2rem] bg-slate-50 text-slate-950 shadow-2xl shadow-violet-950/10 lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:rounded-[2.25rem]">

      {/* HEADER */}
      <div
        className="relative min-h-[17rem] overflow-hidden bg-cover bg-center bg-no-repeat px-7 pb-20 pt-10 text-white sm:px-8 lg:flex lg:min-h-[640px] lg:items-center lg:px-10 lg:pb-10 lg:pt-10"
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
            Selamat datang kembali
          </h1>
          <p className="mt-3 max-w-[17rem] text-sm font-medium leading-6 text-white/85 lg:max-w-xs lg:text-base lg:leading-7">
            Login untuk melanjutkan pengalaman pengiriman terbaik bersama GEx.
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
                Login ke Akun Anda
              </h2>
              <p className="mt-1 text-sm font-medium leading-5 text-slate-500">
                Gunakan WhatsApp atau username untuk login.
              </p>
            </div>
          </div>

          {/* ERROR */}
          {successMessage && (
            <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="grid grid-cols-2 gap-1.5 rounded-full bg-slate-100 p-1 shadow-inner shadow-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('username');
                  setError(null);
                }}
                className={`flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${loginMode === 'username'
                  ? 'bg-white text-violet-700 shadow-md shadow-violet-950/10'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Username
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('phone');
                  setError(null);
                }}
                className={`flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${loginMode === 'phone'
                  ? 'bg-white text-violet-700 shadow-md shadow-violet-950/10'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Nomor HP
              </button>
            </div>

            <InputField
              label={loginMode === 'phone' ? 'Nomor HP' : 'Username'}
              value={identifier}
              onChange={(e) => setIdentifier(loginMode === 'phone' ? e.target.value.replace(/[^\d+]/g, '') : e.target.value)}
              placeholder={loginMode === 'phone' ? 'Contoh: 081234567890' : 'Contoh: username'}
              inputMode={loginMode === 'phone' ? 'tel' : 'text'}
              autoComplete="username"
              icon={loginMode === 'phone' ? Phone : User}
              required
              {...inputAccentClasses}
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              autoComplete="current-password"
              icon={LockKeyhole}
              required
              {...inputAccentClasses}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !identifier || !password}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-red-500 via-fuchsia-600 to-blue-700 px-5 text-base font-black text-white shadow-xl shadow-fuchsia-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-fuchsia-700/30 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span>{loading ? 'Masuk...' : 'Login'}</span>
                {!loading && (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400">atau</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition-colors hover:text-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-xl shadow-violet-950/10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-950">
                Belum punya akun?
              </p>
              <p className="text-xs font-medium leading-5 text-slate-500">
                Daftar sekarang dan mulai kirim paketmu.
              </p>
            </div>
            <Link
              to="/register"
              className="shrink-0 rounded-full border border-violet-600 px-4 py-2 text-sm font-black text-violet-700 transition-all duration-300 hover:bg-violet-50 hover:shadow-lg hover:shadow-violet-700/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
