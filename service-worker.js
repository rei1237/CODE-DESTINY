/* Service Worker - kkul-mansaeryeok\n   Cache version: v3 (Network-First strategy)\n   - v1/v2 caches are automatically deleted on activate\n*/

const CACHE_NAME = 'kkul-mansaeryeok-v8';

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Noto+Serif+KR:wght@400;700&family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@700;900&family=Noto+Sans+KR:wght@300;400;700&display=swap'
];

self.addEventListener('message', event => {
  if (event && event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

/* Network-First: always try network, fall back to cache */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('pagead') || event.request.url.includes('google-analytics')) return;
  if (event.request.url.includes('emailjs') || event.request.url.includes('api.')) return;

  const reqUrl = new URL(event.request.url);
  const sameOrigin = reqUrl.origin === self.location.origin;
  const dest = event.request.destination;
  const isCoreAsset = sameOrigin && (
    dest === 'document' || dest === 'script' || dest === 'style' ||
    reqUrl.pathname === '/' || reqUrl.pathname === '/index.html'
  );

  // Core app shell is network-first with no-store to avoid stale mixed versions on mobile.
  if (isCoreAsset) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('/');
        })
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type === 'opaque') return response;
      const toCache = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('/index.html');
      })
    )
  );
});
