import { Handler as FetchHandler, AppShellHandler, GameFilesHandler, AssetsHandler } from "./fetch";

console.log("imported service worker class");

class ServiceWorker implements EventListenerObject {
	private global: ServiceWorkerGlobalScope;
	private fetchHandlers: FetchHandler[];

	constructor(global: ServiceWorkerGlobalScope) {
		this.global = global;
		this.fetchHandlers = [new AppShellHandler(), new AssetsHandler(), new GameFilesHandler()];
	}

	public run(): void {
		console.assert(
			!("document" in this.global),
			"[ServiceWorker] Worker should not run in main window context!"
		);

		this.global.addEventListener("activate", () => console.log("activate 1"));
		this.global.addEventListener("install", () => console.log("install"));
		this.global.addEventListener("fetch", () => console.log("fetch"));
	}

	handleEvent(e: ExtendableEvent): void {
		switch (e.type) {
			case "activate":
				e.waitUntil(this.handleActivate());
				return;
			case "install":
				e.waitUntil(this.handleInstall(e));
				return;
			case "fetch": {
				const event = e as FetchEvent;
				const handler = this.fetchHandlers.find(handler => handler.shouldHandle(event.request));
				if (handler) event.respondWith(handler.handle(event.request));
				return;
			}
			default:
				this.log(`Unknown ${e.type} event received`);
		}
	}

	private async handleActivate(): Promise<void> {
		this.log("Activate");
		await this.clearOldCaches();
		await this.global.clients.claim();
	}

	private async clearOldCaches() {
		this.log("Clearing old caches");
		const currentCacheNames = this.fetchHandlers.map(h => h.cacheName);
		const usedCacheNames = await caches.keys();

		for (const cacheName of usedCacheNames) {
			if (currentCacheNames.includes(cacheName)) continue;
			this.log(`Clearing cache ${cacheName}`);
			await caches.delete(cacheName);
		}
	}

	private async handleInstall(_: Event): Promise<void> {
		this.log("Install");
		const filesResponse = await fetch("assets/install.json");
		const files = await filesResponse.json();
		const cache = await caches.open(this.fetchHandlers[1].cacheName);
		this.log("Preload", files.length, "files");
		await cache.addAll(files);
		await this.global.skipWaiting();
	}

	private log(...args: any[]): void {
		console.log("[ServiceWorker]", ...args);
	}
}

export default ServiceWorker;
