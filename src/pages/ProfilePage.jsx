import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, Save } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { LoadingState } from '../components/common/Loading';
import Header from '../components/home/Header';
import { useAuth } from '../context/useAuth';
import { profileApi } from '../services/api/profileApi';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsapp_number || '');
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const canEdit = profile?.role === 'customer';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await profileApi.getProfile();
        setProfile(data);
        setWhatsappNumber(data.whatsapp_number || '');
        updateUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [updateUser]);

  const handleConfirmLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      setError('WhatsApp harus berupa angka 10-15 digit.');
      return;
    }

    try {
      setSavingProfile(true);
      const data = await profileApi.updateProfile({
        whatsapp_number: whatsappNumber,
      });
      setProfile(data);
      updateUser(data);
      setMessage('Profil berhasil diperbarui.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordForm.new_password.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    try {
      setSavingPassword(true);
      await profileApi.changePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '' });
      setMessage('Password berhasil diperbarui.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const initial = (
    profile?.name?.[0] ||
    profile?.username?.[0] ||
    'U'
  ).toUpperCase();

  return (
    <div className="flex min-h-dvh flex-col bg-[#F6F7FB] lg:px-6">
      <Header onLogout={handleConfirmLogout} variant="profile" />

      <main className="relative z-10 -mt-[60px] flex-1 space-y-5 overflow-y-auto px-4 pb-8 scrollbar-hide lg:mx-auto lg:grid lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:px-6">
        {loading ? (
          <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <LoadingState variant="section" text="Memuat profil..." />
          </div>
        ) : (
          <>
            <section className="rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-4">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#7B2FF7] to-[#3A6BFF] text-3xl font-extrabold text-white shadow-lg shadow-violet-500/25">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-extrabold leading-tight text-gray-900">{profile?.name || '-'}</h2>
                  <p className="mt-1 truncate text-sm font-medium text-gray-500">@{profile?.username || '-'}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm">
                <InfoRow icon={<FaWhatsapp className="h-5 w-5" />} label="WhatsApp" value={profile?.whatsapp_number || '-'} />
              </div>
            </section>

            {message && (
              <div className="rounded-2xl border border-green-100 bg-green-50 p-3 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {canEdit ? (
              <>
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-5 rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Edit Profil</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">Ubah nomor WhatsApp akun customer Anda.</p>
                  </div>

                  <InputField
                    label="Nomor WhatsApp"
                    icon={Phone}
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="628123456789"
                    labelClassName="font-semibold text-gray-900"
                    iconClassName="text-green-500"
                    inputClassName="h-[52px] rounded-2xl border-gray-200 bg-white text-[15px] text-gray-900 focus:border-[#7B2FF7] focus:ring-4 focus:ring-[#7B2FF7]/10"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={savingProfile}
                    loading={savingProfile}
                    loadingText="Menyimpan..."
                    className="h-[54px] rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#3A6BFF] text-base font-bold text-white shadow-lg shadow-violet-500/30 hover:opacity-95 focus:ring-[#7B2FF7]"
                  >
                    <span className="inline-flex items-center justify-center gap-3">
                      <Save className="h-5 w-5" />
                      Simpan Profil
                    </span>
                  </Button>
                </form>

                <form
                  onSubmit={handleChangePassword}
                  className="space-y-5 rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#7B2FF7]" />
                    <h3 className="text-lg font-bold text-gray-900">Ganti Password</h3>
                  </div>

                  <InputField
                    label="Password Saat Ini"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        current_password: e.target.value,
                      }))
                    }
                    labelClassName="font-semibold text-gray-900"
                    inputClassName="h-[52px] rounded-2xl border-gray-200 bg-white text-[15px] text-gray-900 focus:border-[#7B2FF7] focus:ring-4 focus:ring-[#7B2FF7]/10"
                    required
                  />

                  <InputField
                    label="Password Baru"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        new_password: e.target.value,
                      }))
                    }
                    labelClassName="font-semibold text-gray-900"
                    inputClassName="h-[52px] rounded-2xl border-gray-200 bg-white text-[15px] text-gray-900 focus:border-[#7B2FF7] focus:ring-4 focus:ring-[#7B2FF7]/10"
                    required
                  />

                  <Button
                    type="submit"
                    variant="secondary"
                    fullWidth
                    loading={savingPassword}
                    loadingText="Menyimpan..."
                    disabled={
                      savingPassword ||
                      !passwordForm.current_password ||
                      !passwordForm.new_password
                    }
                    className="h-[54px] rounded-2xl bg-violet-100 text-base font-bold text-[#6D28D9] shadow-none hover:bg-violet-200 focus:ring-[#7B2FF7]"
                  >
                    <span className="inline-flex items-center justify-center gap-3">
                      <Lock className="h-5 w-5" />
                      Ganti Password
                    </span>
                  </Button>
                </form>
              </>
            ) : (
              <section className="rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-gray-900">Akses Profil</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Akun internal hanya dapat melihat informasi profil.
                </p>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-[#F8F8FA] px-4 py-3">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-green-500 shadow-sm">
          {icon}
        </span>
        <span className="text-[15px] font-medium">{label}</span>
      </div>
      <span className="break-all text-right text-[15px] font-bold text-gray-900">{value}</span>
    </div>
  );
}
