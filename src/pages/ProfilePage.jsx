import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone } from 'lucide-react';
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
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <Header onLogout={handleConfirmLogout} />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4 scrollbar-hide">
        {loading ? (
          <LoadingState variant="section" text="Memuat profil..." />
        ) : (
          <>
            <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900 truncate">{profile?.name || '-'}</h2>
                  <p className="text-sm text-gray-500 truncate">@{profile?.username || '-'}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <InfoRow icon={<Phone className="w-4 h-4" />} label="WhatsApp" value={profile?.whatsapp_number || '-'} />
              </div>
            </section>

            {message && (
              <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm border border-green-100">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
                {error}
              </div>
            )}

            {canEdit ? (
              <>
                <form
                  onSubmit={handleUpdateProfile}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">Edit Profil</h3>
                    <p className="text-xs text-gray-500 mt-1">Ubah nomor WhatsApp akun customer Anda.</p>
                  </div>

                  <InputField
                    label="Nomor WhatsApp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="628123456789"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={savingProfile}
                    loading={savingProfile}
                    loadingText="Menyimpan..."
                  >
                    Simpan Profil
                  </Button>
                </form>

                <form
                  onSubmit={handleChangePassword}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <h3 className="font-bold text-gray-900">Ganti Password</h3>
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
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={savingPassword}
                    loadingText="Menyimpan..."
                    disabled={
                      savingPassword ||
                      !passwordForm.current_password ||
                      !passwordForm.new_password
                    }
                  >
                    Ganti Password
                  </Button>
                </form>
              </>
            ) : (
              <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900">Akses Profil</h3>
                <p className="text-sm text-gray-500 mt-1">
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
    <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-gray-800 text-right break-all">{value}</span>
    </div>
  );
}
