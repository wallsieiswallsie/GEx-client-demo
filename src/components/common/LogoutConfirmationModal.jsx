import React, { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';

const ANIMATION_DURATION = 180;

export default function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    closeTimerRef.current = window.setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_DURATION);

    return () => {
      window.clearTimeout(closeTimerRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, shouldRender]);

  if (!shouldRender) return null;

  const animationClass = isOpen
    ? 'opacity-100 scale-100'
    : 'opacity-0 scale-95';

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirmation-title"
        aria-describedby="logout-confirmation-description"
        className={`w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${animationClass}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <LogOut className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2
              id="logout-confirmation-title"
              className="text-base font-bold text-gray-900 dark:text-white"
            >
              Keluar dari akun?
            </h2>
            <p
              id="logout-confirmation-description"
              className="mt-1 text-sm leading-6 text-gray-500 dark:text-slate-300"
            >
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-slate-600 dark:focus:ring-offset-slate-900"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:scale-[0.98] dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-500 dark:focus:ring-offset-slate-900"
          >
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
