import React from 'react';

export default function InputField({ label, type = "text", value, onChange, placeholder, required }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
      />
    </div>
  );
}
