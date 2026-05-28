const CACHE_NAME = "blackcurrant-v3";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/logo.svg",
  "/logo2.svg",
];

const DEV_PATHS = ["/@vite/", "/src/", "/node_modules/"];

function isSameOrigin(request) {
  return request.url.startsWith(self.location.origin);
}

function isDevRequest(request) {
  const url = new URL(request.url);
  return DEV_PATHS.some((p) => url.pathname.startsWith(p));
}

function isStaticAsset(request) {
  const url = new URL(request.url);

  if (request.destination === "script") return true;
  if (request.destination === "style") return true;
  if (request.destination === "image") return true;
  if (request.destination === "font") return true;

  return (
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".mjs") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2")
  );
}

async function cacheResponse(request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  if (!isSameOrigin(request)) return;
  if (isDevRequest(request)) return;

  const url = new URL(request.url);

  // Navigation: network first, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          event.waitUntil(cacheResponse(request, clone));
          return response;
        })
        .catch(() => caches.match("/index.html")),
    );
    return;
  }

  // Static assets: cache first, revalidate in background
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          const clone = response.clone();
          event.waitUntil(cacheResponse(request, clone));
          return response;
        });

        if (cached) {
          event.waitUntil(networkFetch);
          return cached;
        }

        return networkFetch;
      }),
    );
    return;
  }

  // Everything else: network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        event.waitUntil(cacheResponse(request, clone));
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
