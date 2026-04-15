import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

export default function OtpModal({ isOpen, onClose, whatsappNumber, onVerify, onResend }) {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleVerify = () => {
    onVerify(otp);
  };

  const handleResend = () => {
    onResend();
    setTimer(60); // Reset timer 60 detik (Rate limit protection UI)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Verifikasi OTP</h2>
          <p className="text-sm text-gray-500 mt-2">Kode dikirim via SMS ke <span className="font-semibold">{whatsappNumber}</span></p>
        </div>
        
        <input
          type="text"
          maxLength={6}
          value={otp}
          autoFocus
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-gray-300"
          placeholder="••••••"
        />

        <div className="w-full space-y-3">
          <Button onClick={handleVerify} fullWidth disabled={otp.length !== 6}>
            Verifikasi & Daftar
          </Button>

          <Button 
            variant="secondary" 
            onClick={handleResend} 
            disabled={timer > 0} 
            fullWidth
          >
            {timer > 0 ? `Kirim ulang (${timer}s)` : 'Kirim ulang OTP'}
          </Button>

          <button onClick={onClose} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
