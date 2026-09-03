self.addEventListener("install", (event) => {
  event.waitUntil(caches.open("jarvis-talk-v1").then((cache) => cache.addAll([
    "./talk.html",
    "./manifest.json",
    "./icon.svg"
  ])));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
