import Commands from "./commands";

class WebWorkerProxyHandler<T> {
	private backend: Worker;
	private nextMessageId: number = +Commands.Count;
	private handlers: { [_: number]: { resolve: Function; reject: Function } } = {};

	constructor(backend: Worker) {
		this.backend = backend;
		this.backend.onmessage = (e: MessageEvent) => this.handleMessage(e);
	}

	handleMessage(e: MessageEvent) {
		const [mid, error, result] = e.data;
		if (error) this.handlers[mid].reject(error);
		else this.handlers[mid].resolve(result);
		delete this.handlers[mid];
	}

	get(target: T, key: keyof T) {
		const value = target[key];
		if (!(value instanceof Function)) return value;
		return (...args: any[]) => this.callMethod(key, args);
	}

	private callMethod(name: keyof T, args: any[]) {
		const messageId = this.nextMessageId++;
		return new Promise((resolve, reject) => {
			this.handlers[messageId] = { resolve, reject };
			this.backend.postMessage([messageId, name, ...args]);
		});
	}
}

export default WebWorkerProxyHandler;
