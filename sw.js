const cacheName = 'offline-cache-v1'
const cacheUrls = [
  'index.html',
  '//unpkg.com/@picocss/pico',
  '//unpkg.com/htmx.org',
  '//unpkg.com/htmx.org/dist/ext/client-side-templates',
  '//unpkg.com/handlebars/dist/handlebars.min.js',
  '//opensheet.elk.sh/1ngRi2HTDztn_EKxL912kH0s3p7-Y04x35GEposNee2A/sheet1',
]

// Installing the Service Worker
self.addEventListener('install', async (event) => {
  try {
    const cache = await caches.open(cacheName)
    await cache.addAll(cacheUrls)
  } catch (error) {
    console.error('Service Worker installation failed:', error)
  }
})

// Fetching resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName)

      try {
        const cachedResponse = await cache.match(event.request)
        if (cachedResponse) {
          console.log('cachedResponse: ', event.request.url)
          return cachedResponse
        }

        const fetchResponse = await fetch(event.request)
        if (fetchResponse) {
          console.log('fetchResponse: ', event.request.url)
          await cache.put(event.request, fetchResponse.clone())
          return fetchResponse
        }
      } catch (error) {
        console.log('Fetch failed: ', error)
        const cachedResponse = await cache.match('index.html')
        return cachedResponse
      }
    })()
  )
})
