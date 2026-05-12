export function extractYoutubeVideoId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (parsed.protocol !== "https:") {
      return null;
    }

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host !== "youtube.com") {
      return null;
    }

    if (parsed.pathname === "/watch") {
      return parsed.searchParams.get("v");
    }

    const [, type, id] = parsed.pathname.split("/");
    if (["embed", "shorts", "live"].includes(type)) {
      return id || null;
    }

    return null;
  } catch {
    return null;
  }
}

export function getYoutubeThumbnail(url) {
  const videoId = extractYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}
