import React from 'react';
import { Instagram } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

export default function NewsBanner({ banners, isLoading }) {
  const data = banners || [];

  return (
    <div className="mx-4 pb-2 lg:mx-0">
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-bold">Berita</h2>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible xl:grid-cols-6">
          <div className="min-w-[132px]">
            <SkeletonCard height="176px" rounded="rounded-2xl" />
          </div>
          <div className="min-w-[132px]">
            <SkeletonCard height="176px" rounded="rounded-2xl" />
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border bg-white p-5 text-center text-sm text-gray-400 shadow-sm">
          Belum ada konten terbaru
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible xl:grid-cols-6">
          {data.map((item) => (
            <button
              key={item.id}
              onClick={() => window.open(item.instagram_url, "_blank")}
              className="relative aspect-[3/4] min-w-[132px] overflow-hidden rounded-2xl bg-gray-200 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 lg:min-w-0"
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title || "Konten Instagram"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                  Konten Instagram
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute left-2.5 top-2.5 flex items-center gap-2">
                <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[9px] font-bold text-white">
                  {item.post_type || "POST"}
                </span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <div className="mb-1 flex items-center gap-1 text-white/90">
                  <Instagram className="h-3 w-3" />
                  <span className="text-[10px] font-medium">Instagram</span>
                </div>
                <p className="line-clamp-2 text-xs font-bold leading-snug text-white drop-shadow">
                  {item.title || "GEx Update"}
                </p>
                {item.caption && (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/80">
                    {item.caption}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
