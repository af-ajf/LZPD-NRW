// sw.js - Service worker for the installable app.
// Precaches the whole shell on install (it is small and fully static), then
// serves it network-first: online, the files on the server always win, so an
// installed copy can never run a stale mix of scripts; offline, every request
// falls back to the cache, so the click dummy keeps working.

"use strict";

const CACHE = "ibms-shell-v4";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/01-tokens.css",
  "./css/02-base.css",
  "./css/03-layout.css",
  "./css/04-components.css",
  "./css/05-responsive.css",
  "./css/06-mobile.css",
  "./js/00-i18n.js",
  "./js/01-icons.js",
  "./js/02-data.js",
  "./js/03-state.js",
  "./js/04-ui.js",
  "./js/05-chrome.js",
  "./js/06-views.js",
  "./js/07-render.js",
  "./js/08-actions.js",
  "./assets/logo.png",
  "./assets/flag-de.svg",
  "./assets/flag-en.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // A navigation always resolves to the shell: routing happens in the hash.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() =>
        caches.match("./index.html", { ignoreSearch: true }),
      ),
    );
    return;
  }

  e.respondWith(
    fetch(req)
      .then((res) => {
        // Webfonts are cross-origin and opaque; store them anyway so the
        // installed app renders in Inter and Lora offline.
        if (res.ok || res.type === "opaque") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })),
  );
});
