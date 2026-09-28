// utils/imgUrl.js
// Single place that turns whatever the backend stores in an image field into a
// usable <img src>. Cloudinary URLs (and data:/blob: previews) pass through
// untouched; legacy relative paths like "/uploads/products/x.jpg" still get the
// backend origin prepended, so old records keep working.
const BASE = (
  import.meta.env.VITE_API_URL_IMG ||
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:8080"
).replace(/\/+$/, "");

export const imgUrl = (p) => {
  if (!p || typeof p !== "string") return "";
  if (/^(https?:)?\/\/|^(data|blob):/i.test(p)) return p;
  return `${BASE}/${p.replace(/^\/+/, "")}`;
};

export default imgUrl;
