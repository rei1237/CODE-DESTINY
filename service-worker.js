/* ══════════════════════════════════════════════════
   🐷 꿀꿀 만세력 — Service Worker (PWA 오프라인 수호진)
   캐시 버전을 올리면 구 캐시가 자동 정화됩니다.
   ══════════════════════════════════════════════════ */

const CACHE_NAME = 'kkul-mansaeryeok-v1';

// 오프라인에서도 보여줄 핵심 자원 목록
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Noto+Serif+KR:wght@400;700&display=swap'
];

/* ── 설치: 핵심 자원 사전 캐싱 ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // 외부 리소스 캐싱 실패 시에도 설치 진행
      });
    }).then(() => self.skipWaiting())
  );
});

/* ── 활성화: 구 캐시 정리 ── */
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

/* ── 요청 처리: Cache-First 전략 (오프라인 우선) ── */
self.addEventListener('fetch', event => {
  // POST 요청 및 외부 API는 캐싱 제외
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('pagead') || event.request.url.includes('google-analytics')) return;
  if (event.request.url.includes('emailjs') || event.request.url.includes('api.')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // 유효한 응답만 캐싱
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // 오프라인 + 미캐시 상태: 기본 페이지 반환
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
