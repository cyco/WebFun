/// <reference lib="webworker" />
const CacheName = "v1";
const Files: string[] = [];

const initialize = (service: ServiceWorkerGlobalScope): void => {
	service.addEventListener("install", event =>
		event.waitUntil(caches.open(CacheName).then(cache => cache.addAll(Files)))
	);

	service.addEventListener("fetch", event =>
		event.respondWith(
			caches.match(event.request).then(
				response =>
					response ||
					fetch(event.request).then(response => {
						caches.open(CacheName).then(cache => cache.put(event.request, response.clone()));
						return response;
					})
			)
		)
	);
};

initialize(self as any);
