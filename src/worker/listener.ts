import Commands from "./commands";

let globalWebWorkerListener: WebWorkerListener = null;
class WebWorkerListener {
	private static targetClasses: { [_: number]: any } = {};
	private static nextId = 10;
	private target: any;
	static Register(thing: { __webfun_worker_class__: number; new (...args: any[]): {} }) {
		thing.__webfun_worker_class__ = this.nextId++;
		this.targetClasses[thing.__webfun_worker_class__] = thing;
	}

	static Initialize() {
		if (globalWebWorkerListener) throw new Error("Global WebWorkerListener already exists");
		globalWebWorkerListener = new WebWorkerListener();
	}

	private constructor() {
		self.onmessage = (e: MessageEvent) => this.handleMessage(e);
		(self as any).postMessage(Commands.Ready);
	}

	private async handleMessage(e: MessageEvent) {
		if (!(e.data instanceof Array)) {
			throw new Error("Invalid message received");
		}

		const cmd = e.data[0];
		switch (cmd) {
			case Commands.Instantiate:
				this.setupProxy(e.data[1]);
				(self as any).postMessage([Commands.Instantiate]);
				break;
			default:
				let result = undefined;
				let error = null;
				try {
					const [, methodName, ...args] = e.data;
					result = await this.target[methodName](...args);
				} catch (e) {
					error = e;
				}
				(self as any).postMessage([cmd, error, result]);
		}
	}

	private setupProxy(id: number) {
		if (this.target) throw new Error("Proxy is already set up");
		const targetClass = this.resolveTargetClass(id);
		if (!targetClass) throw new Error(`Unknown class ${id} can't be proxied`);
		this.target = new targetClass();
	}

	private resolveTargetClass(id: number) {
		return WebWorkerListener.targetClasses[id];
	}
}

export default WebWorkerListener;
