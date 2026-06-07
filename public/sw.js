// public/sw.js
const CACHE = "blackcurrant-v4"; // bump version to force refresh

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(["/", "/index.html"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  if (e.request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;

  // Skip cross-origin requests entirely — don't cache CDN, fonts, or external APIs
  if (url.origin !== self.location.origin) return;

  // Skip SW and manifest from being cached — always fetch fresh
  if (url.pathname === "/sw.js") return;
  if (url.pathname === "/manifest.webmanifest") return;

  // Skip Vite dev paths
  if (["/@vite/", "/src/"].some((p) => url.pathname.startsWith(p))) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fresh = fetch(e.request)
        .then((res) => {
          if (res.ok) {
            caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          }
          return res;
        })
        .catch(() => cached);

      return e.request.mode === "navigate"
        ? fresh.catch(() => caches.match("/index.html"))
        : (cached ?? fresh);
    }),
  );
});
