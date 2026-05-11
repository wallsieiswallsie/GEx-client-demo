import React, { useState } from 'react';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
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
      const res = await authApi.requestOtp(formData.whatsapp_number);
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
      await authApi.requestOtp(formData.whatsapp_number);
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

  return (
    <>
      <div className="w-full mx-auto max-w-[24rem] bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-white">
        
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm font-medium">Lengkapi identitas Anda di bawah ini</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField 
             label="Nama Lengkap" 
             value={formData.name} 
             onChange={(e) => handleChange(e, 'name')} 
             placeholder="Cth: Budi Santoso" 
             required 
          />
          <InputField 
             label="Username" 
             value={formData.username} 
             onChange={(e) => handleChange(e, 'username')} 
             placeholder="Cth: budi123" 
             required 
          />
          <InputField 
             label="No WhatsApp Aktif" 
             value={formData.whatsapp_number} 
             onChange={(e) => handleChange(e, 'whatsapp_number')} 
             placeholder="Cth: 0812345678" 
             required 
          />
          <InputField 
             label="Password" 
             type="password" 
             value={formData.password} 
             onChange={(e) => handleChange(e, 'password')} 
             placeholder="Buat sandi yang aman" 
             required 
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              loadingText="Sabar, sedang sinkronisasi..."
              fullWidth
            >
              Daftar Sekarang
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium mt-8">
          Punya akun?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Coba login
          </a>
        </p>
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
