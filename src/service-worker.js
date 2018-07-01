const currentVersion = 'cc-static';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(currentVersion).then(cache =>
    cache.addAll([
      '/',
      '/app.js',
      '/assets/css/bootstrap.min.css'])));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(cacheNames =>
    Promise.all(cacheNames
      .filter(cacheName =>
        cacheName.startsWith('cc-') && cacheName !== currentVersion)
      .map(cacheName => caches.delete(cacheName)))));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)));
});
