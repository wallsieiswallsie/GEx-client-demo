import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_SITEMAP_ROUTES, ROBOTS_DISALLOW_ROUTES } from "../src/config/seo.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const publicDir = join(rootDir, "public");
const envPath = join(rootDir, ".env");

function readDotEnvValue(key) {
  if (!existsSync(envPath)) return "";

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  const line = lines.find((item) => item.trim().startsWith(`${key}=`));
  if (!line) return "";

  return line
    .slice(line.indexOf("=") + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function normalizeSiteUrl(value) {
  const siteUrl = String(value || "").trim().replace(/\/+$/, "");

  if (!siteUrl) {
    throw new Error("VITE_SITE_URL is required to generate sitemap.xml and robots.txt.");
  }

  if (!/^https?:\/\//i.test(siteUrl)) {
    throw new Error("VITE_SITE_URL must start with http:// or https://.");
  }

  return siteUrl;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || readDotEnvValue("VITE_SITE_URL"));

const uniqueRoutes = Array.from(
  new Set(PUBLIC_SITEMAP_ROUTES.map((route) => route.path).filter(Boolean))
);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueRoutes.map((path) => `  <url>\n    <loc>${xmlEscape(`${siteUrl}${path}`)}</loc>\n  </url>`),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  ...ROBOTS_DISALLOW_ROUTES.map((path) => `Disallow: ${path}`),
  "",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);
