/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;

// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }));

void self.skipWaiting();
clientsClaim();

self.addEventListener("push", (event: PushEvent) => {
  const message = event.data?.text() ?? "No message";

  const handlePush = async () => {
    const clients = await self.clients.matchAll({ type: "window" });

    for (const client of clients) {
      client.postMessage(message);
    }

    if (clients.every((client) => !client.focused)) {
      await self.registration.showNotification("New message", { body: message });
    }
  };

  event.waitUntil(handlePush());
});
