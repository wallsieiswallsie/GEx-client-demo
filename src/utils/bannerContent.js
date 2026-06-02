import { extractYoutubeVideoId, getYoutubeThumbnail } from "./youtube";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const CONTENT_TYPES = ["youtube", "video", "image"];

function hasExtension(url, extensions) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return extensions.some((extension) => pathname.endsWith(extension));
  } catch {
    return false;
  }
}

export function normalizeBannerContentType(banner) {
  const explicitType = String(banner?.content_type || "").toLowerCase();
  if (CONTENT_TYPES.includes(explicitType)) return explicitType;

  const url = banner?.content_url || "";
  if (extractYoutubeVideoId(url)) return "youtube";
  if (hasExtension(url, VIDEO_EXTENSIONS)) return "video";
  if (hasExtension(url, IMAGE_EXTENSIONS)) return "image";

  return "youtube";
}

export function getBannerDestination(banner) {
  return banner?.link_url || banner?.redirect_url || "";
}

export function getBannerYoutubeThumbnail(banner) {
  return getYoutubeThumbnail(banner?.content_url);
}

export function isValidBannerUrlForType(contentType, url) {
  if (!url) return false;
  if (contentType === "youtube") return Boolean(extractYoutubeVideoId(url));

  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
