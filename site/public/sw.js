const CACHE = "ttc-shell-v3";
const SHELL = ["/", "/demo/", "/demo/?demo=1", "/privacy/", "/terms/", "/404.html", "/manifest.webmanifest", "/favicon.svg", "/apple-touch-icon.png", "/assets/evidence-bench-720.webp", "/assets/evidence-bench-1200.webp", "/assets/evidence-bench-social.webp"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/"))));
});
