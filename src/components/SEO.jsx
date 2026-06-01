import { useEffect } from "react";
import { DEFAULT_SEO, NOINDEX_ROBOTS, SITE_URL } from "../config/seo";

function absoluteUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function canonicalUrl(path) {
  if (path) return absoluteUrl(path);
  const currentPath = window.location.pathname || "/";
  return absoluteUrl(currentPath);
}

function upsertMeta(attribute, key, content) {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export default function SEO({
  title,
  description,
  robots,
  canonicalPath,
  image,
  type,
  siteName,
  twitterCard,
}) {
  useEffect(() => {
    const nextTitle = title || DEFAULT_SEO.title;
    const nextDescription = description || DEFAULT_SEO.description;
    const nextRobots = robots || DEFAULT_SEO.robots;
    const nextCanonical = canonicalUrl(canonicalPath);
    const nextImage = absoluteUrl(image || DEFAULT_SEO.image);
    const nextType = type || DEFAULT_SEO.type;
    const nextSiteName = siteName || DEFAULT_SEO.siteName;
    const nextTwitterCard = twitterCard || DEFAULT_SEO.twitterCard;

    document.title = nextTitle;

    upsertMeta("name", "description", nextDescription);
    upsertMeta("name", "robots", nextRobots);
    upsertCanonical(nextCanonical);

    upsertMeta("property", "og:title", nextTitle);
    upsertMeta("property", "og:description", nextDescription);
    upsertMeta("property", "og:image", nextImage);
    upsertMeta("property", "og:url", nextCanonical);
    upsertMeta("property", "og:type", nextType);
    upsertMeta("property", "og:site_name", nextSiteName);

    upsertMeta("name", "twitter:card", nextTwitterCard);
    upsertMeta("name", "twitter:title", nextTitle);
    upsertMeta("name", "twitter:description", nextDescription);
    upsertMeta("name", "twitter:image", nextImage);
  }, [canonicalPath, description, image, robots, siteName, title, twitterCard, type]);

  return null;
}

export function NoIndexSEO() {
  return <SEO robots={NOINDEX_ROBOTS} />;
}
