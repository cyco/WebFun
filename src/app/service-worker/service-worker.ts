import { Handler as FetchHandler, AppShellHandler, GameFilesHandler, AssetsHandler } from "./fetch";

class ServiceWorker implements EventListenerObject {
	private global: ServiceWorkerGlobalScope;
	private fetchHandlers: FetchHandler[];

	constructor(global: ServiceWorkerGlobalScope) {
		this.global = global;
		this.fetchHandlers = [new AppShellHandler(), new AssetsHandler(), new GameFilesHandler()];
	}

	public run(): void {
		this.global.addEventListener("install", this);
		this.global.addEventListener("activate", this);
		this.global.addEventListener("fetch", this);
	}

	handleEvent(e: ExtendableEvent): void {
		this.log("handle event", e.type);
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
		}
	}

	private async handleActivate(): Promise<void> {
		this.log("activate");
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
		this.log("install");
		await this.global.skipWaiting();
	}

	private log(...args: any[]): void {
		console.log("[ServiceWorker]", ...args);
	}
}

export default ServiceWorker;
