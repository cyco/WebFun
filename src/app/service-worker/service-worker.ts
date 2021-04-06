import { Handler as FetchHandler, AppShellHandler, GameFilesHandler, AssetsHandler } from "./fetch";

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

		this.global.addEventListener("activate", this);
		this.global.addEventListener("install", this);
		this.global.addEventListener("fetch", this);
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
				const url = new URL(event.request.url);
				const handler = this.fetchHandlers.find(handler => handler.shouldHandle(url));
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
		this.log("Preload", files.length, "files");
		for (const file of files) {
			const url = new URL(file, self.location.href.split("/").slice(0, -1).join("/"));
			const handler = this.fetchHandlers.find(handler => handler.shouldHandle(url));
			const cache = await caches.open(handler.cacheName);
			await cache.add(file);
		}
		await this.global.skipWaiting();
	}

	private log(...args: any[]): void {
		console.log("[ServiceWorker]", ...args);
	}
}

export default ServiceWorker;
