import { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../common/LogoutConfirmationModal';
import { useAuth } from '../../context/useAuth';

export default function Header({ onLogout, children, variant = 'default' }) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Inline component logo
    function GexLogo({ size = 40 }) {
        return (
            <img
                src="/images/logo_gex.png"
                alt="GEX Logo"
                style={{ height: size * 0.6 }}
                className="object-contain"
            />
        );
    }

    if (variant === 'profile') {
        return (
            <header
                className="relative min-h-[240px] overflow-hidden bg-cover bg-center px-6 pt-9 text-white"
                style={{ backgroundImage: "url('/images/header_background/profil.png')" }}
            >
                <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="pt-1">
                        <p className="text-lg font-semibold leading-none text-white/95">Akun</p>
                        <h1 className="mt-3 text-4xl font-extrabold leading-none tracking-normal text-white">
                            Profil
                        </h1>
                    </div>

                    {isAuthenticated && (
                        <button
                            id="btn-logout"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur-[10px] transition hover:bg-white/20 active:scale-95"
                            aria-label="Keluar dari akun"
                            title="Logout"
                        >
                            <LogOut className="h-7 w-7" strokeWidth={2.2} />
                        </button>
                    )}
                </div>

                <LogoutConfirmationModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={onLogout}
                />
            </header>
        );
    }

    return (
        <header className="flex items-center justify-between gap-3 px-4 pt-5 pb-3 bg-white sticky top-0 z-40 border-b border-gray-50">
            <div className="shrink-0">
                <GexLogo size={55} />
            </div>

            {children && (
                <div className="min-w-0 flex-1">
                    {children}
                </div>
            )}

            <div className="flex shrink-0 items-center gap-3">
                {isAuthenticated ? (
                    <button
                        id="btn-logout"
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-transparent text-black transition hover:text-gray-800 active:scale-95"
                        aria-label="Keluar dari akun"
                        title="Logout"
                    >
                        <LogOut className="h-[22px] w-[22px]" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#4d148c] px-3 text-xs font-bold text-white shadow-sm shadow-violet-600/20 transition active:scale-95"
                        aria-label="Masuk ke akun"
                    >
                        <LogIn className="h-4 w-4" />
                        Login
                    </button>
                )}
            </div>

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={onLogout}
            />
        </header>
    );
}
