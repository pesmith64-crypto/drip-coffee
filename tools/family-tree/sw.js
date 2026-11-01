/* App shell for Smith Family Tree. Map imagery stays on the network. */
const CACHE = 'smith-family-tree-v1';
const SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap';
const LEAFLET = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

function isMapImagery(url) {
  return url.hostname === 'server.arcgisonline.com' || url.pathname.indexOf('/MapServer/') !== -1;
}

function isAppExtra(url) {
  if (url.hostname === 'unpkg.com' && url.pathname.indexOf('/leaflet@') === 0) return true;
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return true;
  return false;
}

async function putUrl(cache, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed ' + res.status + ' ' + url);
  const headers = new Headers(res.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  const body = await res.arrayBuffer();
  await cache.put(url, new Response(body, { status: 200, headers: headers }));
}

async function precacheFonts(cache) {
  const res = await fetch(FONT_CSS);
  if (!res.ok) return;
  const css = await res.text();
  await cache.put(FONT_CSS, new Response(css, {
    headers: { 'Content-Type': 'text/css; charset=utf-8' }
  }));
  const urls = [];
  const re = /url\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(css))) urls.push(m[1].replace(/["']/g, ''));
  await Promise.all(urls.map(async (u) => {
    try { await putUrl(cache, u); } catch (e) {}
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL.map((u) => putUrl(cache, u)));
    const index = await cache.match('./index.html');
    if (index) await cache.put('./', index.clone());
    await Promise.allSettled(LEAFLET.map((u) => putUrl(cache, u)).concat(precacheFonts(cache)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (isMapImagery(url)) return;
  const same = url.origin === self.location.origin;
  if (!same && !isAppExtra(url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    const updating = fetch(req).then(async (res) => {
      if (res && res.ok && res.status !== 206) {
        try {
          const headers = new Headers(res.headers);
          headers.delete('content-encoding');
          headers.delete('content-length');
          const body = await res.clone().arrayBuffer();
          await cache.put(req, new Response(body, { status: res.status, statusText: res.statusText, headers: headers }));
        } catch (e) {}
      }
      return res;
    }).catch(() => null);
    if (cached) {
      event.waitUntil(updating.then(() => {}));
      return cached;
    }
    const fresh = await updating;
    if (fresh) return fresh;
    if (req.mode === 'navigate') {
      return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
    }
    return Response.error();
  })());
});
