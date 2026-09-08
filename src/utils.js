export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Very small markdown-ish line break helper: preserve paragraphs, escape everything else.
export function renderBody(text) {
  const escaped = escapeHtml(text || "");
  return escaped
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export function timeAgo(epochSeconds) {
  const now = Math.floor(Date.now() / 1000);
  let diff = now - epochSeconds;
  if (diff < 0) diff = 0;
  const units = [
    ["yr", 31536000],
    ["mo", 2592000],
    ["wk", 604800],
    ["day", 86400],
    ["hr", 3600],
    ["min", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(diff / secs);
    if (val >= 1) return `${val} ${label}${val > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}

export function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  });
  return out;
}

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function redirect(location, cookies) {
  const headers = new Headers({ Location: location });
  if (cookies) {
    for (const c of cookies) headers.append("Set-Cookie", c);
  }
  return new Response(null, { status: 302, headers });
}

export function html(body, init) {
  return new Response(body, {
    ...init,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...(init && init.headers ? init.headers : {}),
    },
  });
}
