import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { authApi } from '../services/api/authApi';

const STEPS = {
  REQUEST: 'request',
  VERIFY: 'verify',
  RESET: 'reset',
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.REQUEST);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const interval = setInterval(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const requestOtp = async (e) => {
    e?.preventDefault();
    setMessage('');
    setError('');

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      setError('WhatsApp harus berupa angka 10-15 digit.');
      return;
    }

    try {
      setLoading(true);
      await authApi.requestForgotPasswordOtp(whatsappNumber);
      setStep(STEPS.VERIFY);
      setCooldown(30);
      setMessage('OTP reset password berhasil dikirim.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (otp.length !== 6) {
      setError('OTP harus 6 digit.');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.verifyForgotPasswordOtp(whatsappNumber, otp);
      setResetToken(res.data.resetToken);
      setStep(STEPS.RESET);
      setMessage('OTP berhasil diverifikasi.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword(resetToken, password, passwordConfirmation);
      navigate('/login', {
        replace: true,
        state: { message: 'Password berhasil direset. Silakan login.' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-[24rem] bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 sm:p-10 space-y-6 border border-white">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-500 text-sm font-medium">
          Verifikasi WhatsApp untuk membuat password baru
        </p>
      </div>

      {message && (
        <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
          {error}
        </div>
      )}

      {step === STEPS.REQUEST && (
        <form onSubmit={requestOtp} className="space-y-5">
          <InputField
            label="Nomor WhatsApp"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="08123xxx / 628123xxx"
            required
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading || !whatsappNumber}
            loading={loading}
            loadingText="Mengirim..."
          >
            Kirim OTP
          </Button>
        </form>
      )}

      {step === STEPS.VERIFY && (
        <form onSubmit={verifyOtp} className="space-y-5">
          <InputField
            label="Kode OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6 digit OTP"
            required
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading || otp.length !== 6}
            loading={loading}
            loadingText="Memverifikasi..."
          >
            Verifikasi OTP
          </Button>

          <Button
            variant="secondary"
            onClick={requestOtp}
            fullWidth
            disabled={loading || cooldown > 0}
          >
            {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang OTP'}
          </Button>
        </form>
      )}

      {step === STEPS.RESET && (
        <form onSubmit={resetPassword} className="space-y-5">
          <InputField
            label="Password Baru"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputField
            label="Konfirmasi Password"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading || !password || !passwordConfirmation}
            loading={loading}
            loadingText="Menyimpan..."
          >
            Reset Password
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-gray-500 font-medium">
        Ingat password?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
