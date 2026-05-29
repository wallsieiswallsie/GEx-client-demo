import { useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Play, Video } from "lucide-react";
import {
  getBannerDestination,
  getBannerYoutubeThumbnail,
  normalizeBannerContentType,
} from "../../utils/bannerContent";
import { SkeletonCard } from "./SkeletonCard";

const AUTOPLAY_DELAY = 5000;

function BannerFallback({ label, icon }) {
  const fallbackIcon = icon || ImageIcon;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200 px-5 text-center text-sm font-medium text-gray-500">
      {fallbackIcon === Play && <Play className="mb-2 h-6 w-6 text-gray-400" />}
      {fallbackIcon === Video && <Video className="mb-2 h-6 w-6 text-gray-400" />}
      {fallbackIcon === ImageIcon && <ImageIcon className="mb-2 h-6 w-6 text-gray-400" />}
      {label}
    </div>
  );
}

function BannerMedia({ banner, type, title }) {
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setMediaError(false);
  }, [banner?.content_url, type]);

  if (type === "youtube") {
    const thumbnail = getBannerYoutubeThumbnail(banner);

    if (!thumbnail || mediaError) {
      return <BannerFallback label="Thumbnail video tidak tersedia" icon={Play} />;
    }

    return (
      <>
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover"
          loading="eager"
          onError={() => setMediaError(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
            <Play className="ml-1 h-6 w-6" fill="white" />
          </div>
        </div>
      </>
    );
  }

  if (type === "video") {
    if (mediaError) {
      return <BannerFallback label="Preview video tidak tersedia" icon={Video} />;
    }

    return (
      <>
        <video
          src={banner.content_url}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          onError={() => setMediaError(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </>
    );
  }

  if (mediaError) {
    return <BannerFallback label="Gambar tidak tersedia" />;
  }

  return (
    <img
      src={banner.content_url}
      alt={title}
      className="h-full w-full object-cover"
      loading="eager"
      onError={() => setMediaError(true)}
    />
  );
}

function BannerSlide({ banner }) {
  const type = normalizeBannerContentType(banner);
  const title = banner.title || "Info GEx";
  const destination = getBannerDestination(banner);
  const openDestination = () => {
    if (destination) window.open(destination, "_blank", "noopener,noreferrer");
  };

  const content = (
    <>
      <BannerMedia banner={banner} type={type} title={title} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <span className="mb-1 inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
          Terbaru
        </span>
        <p className="line-clamp-1 text-sm font-bold leading-tight text-white drop-shadow-md">{title}</p>
        {banner.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/85 drop-shadow-md">
            {banner.description}
          </p>
        )}
      </div>
    </>
  );

  const className =
    "group relative block h-[180px] w-full overflow-hidden rounded-2xl bg-gray-100 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  if (!destination) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={openDestination}
      aria-label={`Buka banner ${title}`}
    >
      {content}
    </button>
  );
}

export default function CustomerBannerCarousel({ banners, isLoading, error }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef(null);
  const interactionRef = useRef(Date.now());

  const activeBanners = useMemo(
    () => (banners || []).filter((banner) => banner?.content_url),
    [banners]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - interactionRef.current;
      if (elapsed < 1200) return;

      setActiveIndex((current) => {
        const next = (current + 1) % activeBanners.length;
        viewportRef.current?.scrollTo({
          left: next * viewportRef.current.clientWidth,
          behavior: "smooth",
        });
        return next;
      });
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [activeBanners.length]);

  const goToSlide = (index) => {
    interactionRef.current = Date.now();
    setActiveIndex(index);
    viewportRef.current?.scrollTo({
      left: index * viewportRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const nextIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < activeBanners.length) {
      interactionRef.current = Date.now();
      setActiveIndex(nextIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-4">
        <SkeletonCard height="180px" rounded="rounded-2xl" />
      </div>
    );
  }

  if (activeBanners.length === 0) {
    return (
      <div className={`mx-4 rounded-2xl border bg-white p-5 text-center text-sm shadow-sm ${error ? "text-red-500" : "text-gray-400"}`}>
        {error ? "Banner belum dapat dimuat" : "Belum ada banner aktif"}
      </div>
    );
  }

  return (
    <section className="mx-4" aria-label="Banner promo">
      <div
        ref={viewportRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl scrollbar-hide"
        onScroll={handleScroll}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id || banner.content_url} className="min-w-full snap-center">
            <BannerSlide banner={banner} />
          </div>
        ))}
      </div>

      {activeBanners.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {activeBanners.map((banner, index) => (
            <button
              key={banner.id || `${banner.content_url}-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === activeIndex ? "w-5 bg-blue-600" : "w-2 bg-gray-300"
              }`}
              aria-label={`Tampilkan banner ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
