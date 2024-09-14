const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies'); //added StaleWhileRevalidate so the service worker can serve up the cached items but also update the cache for future requests.
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST); //this uses the manifest, which is generated at build, to determine which items to precache so that they're available when offline

const pageCache = new CacheFirst({ //serve assets from the cache first; if not found, go to the server
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], //this tells the service worker that only responses of 0 or 200 are to be cached; 404, for example, should not be cached
    }),
    new ExpirationPlugin({ //sets the max age for the cached items (below, it also sets the max number of items that the cache will hold)
      maxAgeSeconds: 30 * 24 * 60 * 60
    })
  ]
});

warmStrategyCache({
  urls: ['/index.html', '/'], //populate teh cache with important urls like index and home; it uses the pageCache strategy defined above
  strategy: pageCache
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache); //registers the route for HTML requests ('navigations'), again, using pageCache

// TODO: Implement asset caching; set up service worker
//this is an example of setting up caching for one asset type: images
registerRoute(
  ({ request }) => request.destination === 'image', //this matches requests for images
  new CacheFirst({
    cacheName: 'my-image-cache',
    plugins: [
      new CacheableResponsePlugin({ 
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

//this is an example of setting up caching for multiple assets in one code block
registerRoute(
  ({ request }) => ['script', 'style'].includes(request.destination), //this matches requests for scripts, styles, and fonts; note how the format differs from a single-asset cache request; this can also include 'font', but we're not caching any fonts for this page, so I omitted it; there may be other assets that can be included here as well
  new StaleWhileRevalidate({ //tells the service worker to check the cache before looking to the server
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      })
    ]
  })
);

offlineFallback({
  pageFallback: './index.html', //this can be a page that specifically tells the user that they're offline
  cacheName: 'offline-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200]
    }),
    new ExpirationPlugin({
      maxEntries: 1, //"1" because we only want to cache whatever page we're using for the offline notification; since we're using the index.html page, we probably don't need this at all
      maxAgeSeconds: 30 * 24 * 60 * 60 //30 days
    })
  ]
});