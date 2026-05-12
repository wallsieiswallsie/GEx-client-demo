import React from 'react';
import { Instagram } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

export default function NewsBanner({ banners, isLoading }) {
  const data = banners || [];

  return (
    <div className="mx-4 pb-2">
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-bold">Berita</h2>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto">
          <div className="min-w-[220px]">
            <SkeletonCard height="150px" rounded="rounded-2xl" />
          </div>
          <div className="min-w-[220px]">
            <SkeletonCard height="150px" rounded="rounded-2xl" />
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border bg-white p-5 text-center text-sm text-gray-400 shadow-sm">
          Belum ada konten terbaru
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {data.map((item) => (
            <button
              key={item.id}
              onClick={() => window.open(item.instagram_url, "_blank")}
              className="relative h-[150px] min-w-[220px] overflow-hidden rounded-2xl bg-gray-200 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
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
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.post_type || "POST"}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="mb-1 flex items-center gap-1 text-white/90">
                  <Instagram className="h-3 w-3" />
                  <span className="text-[10px] font-medium">Instagram</span>
                </div>
                <p className="line-clamp-1 text-sm font-bold text-white drop-shadow">
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
