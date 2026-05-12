export function extractInstagramCode(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (url.protocol !== "https:" || host !== "instagram.com") {
      return null;
    }

    const [, type, code] = url.pathname.split("/");
    if (!["p", "reel"].includes(type)) {
      return null;
    }

    return code || null;
  } catch {
    return null;
  }
}

export function detectInstagramPostType(value) {
  try {
    const url = new URL(value);
    return url.pathname.includes("/reel/") ? "REEL" : "POST";
  } catch {
    return "POST";
  }
}
