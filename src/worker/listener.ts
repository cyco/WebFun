import Commands from "./commands";
import Adder from "./adder";

let globalWebWorkerListener: WebWorkerListener = null;
class WebWorkerListener {
	private target: any;
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

	private setupProxy(name: string) {
		if (this.target) throw new Error("Proxy is already set up");
		const targetClass = this.resolveTargetClass(name);
		if (!targetClass) throw new Error(`Unknown class ${name} can't be proxied`);
		this.target = new targetClass();
	}

	private resolveTargetClass(_: string) {
		return Adder;
	}
}

export default WebWorkerListener;
