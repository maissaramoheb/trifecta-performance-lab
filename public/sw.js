const CACHE = "trifecta-core-v5";
const CORE = [
  "/",
  "/overview",
  "/curriculum",
  "/domains",
  "/trifecta",
  "/comparison",
  "/cases",
  "/checks",
  "/references",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.allSettled(
        CORE.map(async (path) => {
          const response = await fetch(path, { cache: "reload", credentials: "same-origin" });
          if (response.ok) await cache.put(path, response);
        }),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) return;
  const url = new URL(event.request.url);

  // Content-hashed modules already have immutable HTTP caching. Intercepting them
  // risks replaying an authentication error as JavaScript in Safari.
  if (url.pathname.startsWith("/assets/") || url.pathname === "/sw.js") return;

  const isDocument = event.request.mode === "navigate" || event.request.destination === "document";
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && (isDocument || CORE.includes(url.pathname))) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (isDocument) return caches.match("/");
          return Response.error();
        }),
      ),
  );
});
