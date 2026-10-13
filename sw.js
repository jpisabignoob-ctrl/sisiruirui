// Service worker for sisiruirui.com
// It exists so the site can be installed to the home screen and can show notifications
// (Android Chrome and home-screen apps on iOS 16.4+ need a service worker for that).
// It deliberately has no fetch handler and caches nothing: every load comes straight from the
// network, so a new version of index.html is always picked up and nothing can go stale.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Tapping a notification brings an open tab/app to the front, or opens one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const here = all.find((c) => new URL(c.url).origin === self.location.origin);
    if (here) {
      try { return await here.focus(); } catch (e) { /* fall through and open a new one */ }
    }
    return self.clients.openWindow('/');
  })());
});
