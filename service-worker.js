// Service Worker for Couple Expense Tracker PWA
const CACHE_NAME = 'couple-expense-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate event
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
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const clonedResponse = response.clone();
        
        // Update cache with new response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});

// Handle background sync (if browser supports it)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Sync local storage data when connection is restored
      Promise.resolve()
    );
  }
});

// Periodic background sync (optional)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'backup-data') {
    event.waitUntil(
      // Periodic backup of local storage
      Promise.resolve()
    );
  }
});
