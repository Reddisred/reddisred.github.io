importScripts("scram/scramjet.all.js");
importScripts("glass/glassJS.bundle.js");
importScripts("glass/glassJS.config.js");
importScripts("glass/glassJS.sw.js");

const uv =
  typeof UVServiceWorker !== "undefined" ? new UVServiceWorker() : null;

let scramjet = null;
let scramjetReady = null;

if (typeof $scramjetLoadWorker !== "undefined") {
  const { ScramjetServiceWorker } = $scramjetLoadWorker();
  scramjet = new ScramjetServiceWorker();
  scramjetReady = scramjet.loadConfig();
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Notify all clients of a fatal SW error
async function notifyClients(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((client) => client.postMessage({ type: "SW_ERROR", message }));
}

self.addEventListener("error", (event) => {
  notifyClients(`Service worker error: ${event.message}`);
});

self.addEventListener("unhandledrejection", (event) => {
  notifyClients(`Service worker unhandled rejection: ${event.reason}`);
});

self.addEventListener("fetch", (event) => {
  if (!uv || !scramjet || !event.request.url.startsWith("http")) return;

  event.respondWith(
    (async () => {
      try {
        await scramjetReady;
      } catch (e) {
        console.error("Scramjet Config Load Failed:", e);
        await notifyClients(`Scramjet config failed to load: ${e.message}`);
      }

      if (uv.route(event)) {
        return await uv.fetch(event);
      }

      if (scramjet.route(event)) {
        return await scramjet.fetch(event);
      }

      return await fetch(event.request);
    })(),
  );
});