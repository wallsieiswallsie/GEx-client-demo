import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

export default function NewsBanner({ banners, isLoading }) {
  const data = banners || [];

  return (
    <div className="mx-4 pb-2">
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-bold">Berita</h2>
        <a href="#" className="flex items-center gap-1 text-xs text-violet-600">
          Lihat Instagram
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          <SkeletonCard height="140px" />
          <SkeletonCard height="140px" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {data.slice(0, 2).map((b, i) => (
            <img key={i} src={b.image} className="rounded-2xl h-[140px] object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}