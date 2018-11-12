import Factory from "./factory";
import demo from "./demo";
import Listener from "./listener";

function WebWorkerProxy<T extends { new (...args: any[]): {} }>(constructor: T) {
	const proxy = class extends constructor {
		static __webfun_worker_class__: number;
	};
	Listener.Register(proxy);

	return proxy;
}

export { Listener, demo, WebWorkerProxy };
export default Factory;
