import React from 'react';
import { SkeletonCard } from './SkeletonCard';

// Fallback images untuk berita (placeholder lokal)
const FALLBACK_NEWS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80',
    alt: 'Kurir membawa paket',
    caption: 'Layanan Pengiriman Terpercaya',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80',
    alt: 'Gudang logistik',
    caption: 'Gudang Modern GEX',
  },
];

/**
 * NewsBanner — section "Berita" dengan 2-column image grid + link Instagram.
 * Jika ada banner_dashboard dari backend, tampilkan itu; jika tidak, tampilkan fallback.
 */
export default function NewsBanner({ banners, isLoading }) {
  const displayBanners = banners?.length > 0 ? banners : FALLBACK_NEWS;

  return (
    <div className="mx-4 pb-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-gray-800">Berita</h2>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline"
          aria-label="Lihat Instagram GEX"
        >
          Lihat Instagram
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          <SkeletonCard height="140px" />
          <SkeletonCard height="140px" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3" role="list" aria-label="Berita GEX">
          {displayBanners.slice(0, 2).map((banner) => (
            <div
              key={banner.id}
              role="listitem"
              className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
              style={{ height: '140px' }}
            >
              <img
                src={banner.image || banner.content_url}
                alt={banner.alt || banner.title || 'Berita GEX'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay gradient + caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                <span className="text-white text-[10px] font-medium line-clamp-2 leading-tight">
                  {banner.caption || banner.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
