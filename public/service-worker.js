
const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

const CACHE_NAME = 'cache-site-v1';
const DATA_CACHE_NAME = 'data-cache-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>{ 
        cache.addAll(FILES_TO_CACHE);
        console.log("Site cached");
      })
      .then(self.skipWaiting())
  );
});


self.addEventListener("fetch", function(event) {
  // cache all get requests to /api routes
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );
});

// self.addEventListener('fetch', (event) => {
//   console.log(event.headers);
  // For HTML requests, try the network first, fall back to the cache, finally the offline page
 
 
 
  // if (event.request.headers.get('Accept').indexOf('text/html') !== -1) {
  //   request = new Request(url, {
  //     method: 'GET',
  //     headers: request.headers,
  //     mode: request.mode == 'navigate' ? 'cors' : request.mode,
  //     credentials: request.credentials,
  //     redirect: request.redirect
  //   });
  //   event.respondWith(
  //     fetch(request)
  //       .then(response => {
  //         // NETWORK
  //         // Stash a copy of this page in the pages cache
  //         let copy = response.clone();
  //         stashInCache(pagesCacheName, request, copy);
  //         return response;
  //       })
  //       .catch(() => {
  //         // CACHE or FALLBACK
  //         return caches.match(request)
  //           .then(response => response || caches.match('/offline'));
  //       })
  //   );
    // return;
  // }


// });




// if (event.request.url.startsWith(self.location.origin)) {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       return caches.open(RUNTIME).then((cache) => {
//         return fetch(event.request).then((response) => {
//           return cache.put(event.request, response.clone()).then(() => {
//             return response;
//           });
//         });
//       });
//     })
//   );
// } not sure last