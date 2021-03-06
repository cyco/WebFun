import FetchHandler from "./handler";

class AppShellHandler implements FetchHandler {
	public readonly cacheName = "webfun/shell";

	shouldHandle(url: URL): boolean {
		return (
			!url.pathname.includes("/docs/") &&
			(url.pathname.endsWith("/") ||
				url.pathname.endsWith("/?source=pwa") ||
				url.pathname.endsWith("index.html") ||
				url.pathname.endsWith("index.html?source=pwa") ||
				url.pathname.includes("/webfun.js") ||
				url.pathname.includes("/service-worker.js") ||
				url.pathname.includes("/manifest.json") ||
				url.pathname.includes("/assets/install.json"))
		);
	}

	async handle(request: Request): Promise<Response> {
		try {
			const response = await fetch(request);
			if (response.ok) {
				const cache = await caches.open(this.cacheName);
				cache.put(request, response.clone());
				// TODO: consider caching response under alternative url (`/` vs `/index.html`) as well
				this.log("Caching", response.url, "in", this.cacheName);
			}

			return response;
		} catch (error) {
			console.warn("[ServiceWorker]", "AppShellHandler caught", error);
		}

		return await caches.match(request);
	}

	private log(...args: any[]): void {
		console.log("[ServiceWorker]", ...args);
	}
}

export default AppShellHandler;
