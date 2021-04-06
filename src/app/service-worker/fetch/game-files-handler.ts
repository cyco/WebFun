import Handler from "./handler";

class GameFilesHandler implements Handler {
	public readonly cacheName: string = "webfun/games";

	shouldHandle(url: URL): boolean {
		return (
			url.hostname.endsWith("archive.org") ||
			url.pathname.includes("/game-data/") ||
			url.pathname.includes("/data/")
		);
	}

	async handle(request: Request): Promise<Response> {
		const cachedResponse = await caches.match(request);
		if (cachedResponse) return cachedResponse;

		const response = await fetch(request);
		if (!response.ok) return response;

		const cache = await caches.open(this.cacheName);
		cache.put(request, response.clone());
		this.log("Caching", response.url, "in", this.cacheName);

		return response;
	}

	private log(...args: any[]): void {
		console.log("[ServiceWorker]", ...args);
	}
}

export default GameFilesHandler;
