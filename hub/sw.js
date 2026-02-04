var PROXY = 'https://graphing-calc-math.gormax-g.workers.dev/proxy?url=';
var ALLOWED = [
  'cdn.jsdelivr.net',
  'cdn.tailwindcss.com',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'poki-gdn.com',
  'poki.com',
  'games.poki.com'
];

function shouldProxy(url) {
  try {
    var u = new URL(url);
    for (var i = 0; i < ALLOWED.length; i++) {
      if (u.hostname === ALLOWED[i] || u.hostname.endsWith('.' + ALLOWED[i])) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Take control immediately
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

// Intercept ALL requests
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  if (shouldProxy(url)) {
    var proxyUrl = PROXY + encodeURIComponent(url);
    event.respondWith(
      fetch(proxyUrl).then(function(response) {
        // Clone response with correct headers
        var headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }).catch(function(err) {
        // If proxy fails, try direct
        return fetch(event.request);
      })
    );
  }
});
