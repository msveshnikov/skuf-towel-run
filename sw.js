const CACHE_NAME = "skuf-run-v2";

// NOTE: Do NOT include "./" here — on real web servers it returns a 301 redirect
// which cache.addAll() rejects, silently aborting the entire service worker install.
const ASSETS = [
  "/index.html",
  "/style.css",
  "/game.js",
  "/sprite-processor.js",
  "/manifest.json",
  "/assets/skuf_sprites.jpg",
  "/assets/granny_sprites.jpg",
  "/assets/icon-192.png",
  "/assets/icon-512.png"
];

// Install — cache each asset individually so one failure doesn't kill the whole install
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn("[SW] Failed to cache:", url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate — delete all old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — navigation always gets index.html from cache; assets get cache-first
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // For page navigations, always respond with cached index.html
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match("/index.html").then((cached) => cached || fetch(e.request))
    );
    return;
  }

  // For all other assets: cache-first, network fallback
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        // Opportunistically cache successful GET responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
