var cacheName = 'goat-cache-v5';
var urlsToCache = [
    '/',
    '/sw.js',
    '/favicon.ico',
    '/manifest.json',
    '/dist/main.js',
    '/dist/vendor.js',
    '/dist/site.css',
    '/images/page_bg.png',
    '/images/goat-notification.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-48x48.png',
    '/images/icons/icon-512x512.png',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/goats/1.jpg',
    '/images/goats/2.jpg',
    '/images/goats/3.jpg',
    '/images/goats/4.jpg',
    '/images/goats/5.jpg',
    '/images/goats/6.jpg',
    '/images/goats/7.jpg',
    '/images/goats/8.jpg',
    '/images/goats/9.jpg',
    '/images/goats/10.jpg',
    '/images/goats/11.jpg',
    '/images/goats/12.jpg',
    '/images/goats/13.jpg',
    '/images/goats/14.jpg',
    '/images/goats/15.jpg',
    '/images/goats/16.jpg',
    '/images/goats/17.jpg',
    '/images/goats/18.jpg',
    '/images/goats/19.jpg'
];

self.addEventListener('install', function (event) {
    // offline cache
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            var staleCaches = cacheNames.filter(name => name !== cacheName);
            console.log('removing stale caches', staleCaches);
            return Promise.all(
                staleCaches.map(name => caches.delete(name)));
        }));
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            }));
});