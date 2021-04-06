import Handler from "./handler";

class GameFilesHandler implements Handler {
	public readonly cacheName: string = "webfun/games";

	shouldHandle(request: Request): boolean {
		const url = new URL(request.url);

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

		return response;
	}
}

export default GameFilesHandler;
