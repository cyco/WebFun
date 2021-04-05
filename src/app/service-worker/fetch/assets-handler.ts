import Handler from "./handler";

class AssetsHandler implements Handler {
	public readonly cacheName = `webfun/assets-${process.env.VERSION}`;

	shouldHandle(request: Request): boolean {
		return (
			!request.url.includes("__webpack_dev_server__") &&
			(request.url.endsWith(".js") || request.url.includes("/assets/"))
		);
	}

	async handle(request: Request): Promise<Response> {
		const cachedResponse = await caches.match(request);
		if (cachedResponse) return cachedResponse;

		const response = await fetch(request);
		if (response.type === "error" || response.type === "opaque") {
			return response;
		}

		const cache = await caches.open(this.cacheName);
		cache.put(request, response.clone());

		return response;
	}
}

export default AssetsHandler;
