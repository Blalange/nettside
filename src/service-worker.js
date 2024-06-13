import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

skipWaiting();
clientsClaim();


self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches()

registerRoute(
  ({ url }) => url.href.match(/^https:\/\/db\.080609\.xyz\/api\/collections\/art_articles.*$/),
  new CacheFirst({
    cacheName: 'article-cache',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 0.25, // 15 min
        maxEntries: 100,
      })
    ],
  })
);

registerRoute(
  ({ url }) => url.href.match(/^https:\/\/db\.080609\.xyz\/api\/collections\/art_authors.*$/),
  new CacheFirst({
    cacheName: 'author-cache',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        maxEntries: 100,
      })
    ],
  })
);

// Default to `networkFirst` strategy for all other requests.
registerRoute(
  ({ event }) => event.request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          return await createHandlerBoundToURL('/index.html').handle({ event });
        } catch (error) {
          return Response.error();
        }
      })()
    );
  }
});
