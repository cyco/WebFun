import Handler from "./handler";

class AssetsHandler implements Handler {
	public readonly cacheName = `webfun/assets-${process.env.VERSION}`;

	shouldHandle(url: URL): boolean {
		return (
			!url.pathname.includes("__webpack_dev_server__") &&
			(url.pathname.endsWith(".js") || url.pathname.includes("/assets/"))
		);
	}

	async handle(request: Request): Promise<Response> {
		const cachedResponse = await caches.match(request);
		if (cachedResponse) return cachedResponse;

		const response = await fetch(request);
		if (!response.ok) return response;

		const cache = await caches.open(this.cacheName);
		cache.put(request, response.clone());

		return response;
	}

	private log(...args: any[]): void {
		console.log("[ServiceWorker]", ...args);
	}
}

export default AssetsHandler;
