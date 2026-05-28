import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Phone, User } from 'lucide-react';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
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

  return (
    <div className="w-full mx-auto max-w-[24rem] bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 sm:p-10 space-y-8 border border-white">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          GEX App
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Selamat datang kembali
        </p>
      </div>

      {/* ERROR */}
      {successMessage && (
        <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setLoginMode('username');
              setError(null);
            }}
            className={`flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${loginMode === 'username'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500'
              }`}
          >
            <User className="h-4 w-4" />
            Username
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('phone');
              setError(null);
            }}
            className={`flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${loginMode === 'phone'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500'
              }`}
          >
            <Phone className="h-4 w-4" />
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
          required
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || !identifier || !password}
            loading={loading}
            loadingText="Masuk..."
            fullWidth
          >
            Login
          </Button>
        </div>
      </form>

      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 font-medium">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          Daftar disini
        </Link>
      </p>
    </div>
  );
}
