const CACHE_NAME = 'tools-dz-v1';
const OFFLINE_URL = 'offline.html';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './offline.html',
    './404.html',
    './manifest.webmanifest',
    './assets/css/main.css',
    './assets/css/responsive.css',
    './assets/css/tools.css',
    './assets/js/app.js',
    './assets/js/theme.js',
    './assets/js/search.js',
    './assets/js/tools.js',
    './assets/js/favorites.js',
    './data/tools.json',
    './data/categories.json',
    './data/salary-rules.json',
    // We cache essential tools that don't rely strictly on APIs
    './tools/calorie-calculator.html',
    './tools/age-calculator.html',
    './tools/loan-calculator.html',
    './tools/salary-calculator.html',
    './tools/electricity-calculator.html',
    './tools/car-cost-calculator.html',
    './tools/fuel-calculator.html',
    './tools/unit-converter.html',
    './tools/invoice-generator.html',
    './tools/cv-builder.html',
    './tools/image-compressor.html',
    './tools/qr-generator.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Using a safe addAll approach: if one fails, it doesn't break everything
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => {
                    return fetch(new Request(url, { cache: 'reload' })).then(response => {
                        if (response.ok) {
                            return cache.put(url, response);
                        }
                    }).catch(err => {
                        console.warn('Failed to cache during install:', url, err);
                    });
                })
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // We only care about GET requests
    if (event.request.method !== 'GET') return;

    // Ignore external requests for caching unless specifically needed
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('cdnjs') && !event.request.url.includes('unpkg') && !event.request.url.includes('jsdelivr')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                // If the response is good, optionally cache it (dynamic caching)
                // For now, we just return it.
                return networkResponse;
            }).catch(() => {
                // If it's a navigation request and fails, show offline page
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});