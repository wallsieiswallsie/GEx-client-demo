import React from 'react';

/**
 * SkeletonCard — animasi skeleton loading generik.
 * Props:
 *   - className: tambahan class pada container
 *   - height: tinggi skeleton (default '5rem')
 *   - rounded: border radius (default 'rounded-xl')
 */
export function SkeletonCard({ className = '', height = '5rem', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
      style={{ height }}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonText — baris teks skeleton.
 */
export function SkeletonText({ width = '100%', className = '' }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-md h-4 ${className}`}
      style={{ width }}
      aria-hidden="true"
    />
  );
}
