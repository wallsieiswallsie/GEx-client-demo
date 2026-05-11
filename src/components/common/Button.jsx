import React from 'react';
import { ButtonLoading } from './Loading';

export default function Button({ children, onClick, type = "button", variant = "primary", disabled = false, fullWidth = false, loading = false, loadingText = "Memproses..." }) {
  const baseStyle = "min-w-32 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 focus:ring-blue-600",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm focus:ring-gray-300",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={` ${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading ? <ButtonLoading text={loadingText} /> : children}
    </button>
  );
}
