self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).then(response => response));
});
