import React from 'react';

export default function FloatingActionButton({
  children,
  onClick,
  className = '',
  ariaLabel = 'Tambah',
  title = 'Tambah',
  dataTour,
}) {
  return (
    <button
      data-tour={dataTour}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={`fixed right-[max(1.5rem,calc((100vw-430px)/2+1.5rem))] bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition ${className}`}
    >
      {children}
    </button>
  );
}
