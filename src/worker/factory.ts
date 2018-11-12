import OwnOriginalSourceURL from "./own-source-url";
import Commands from "./commands";
import ProxyHandler from "./proxy-handler";

class WebWorkerFactory {
	public static async Spawn<T extends { new (): InstanceType<T> }>(
		targetClass: T,
		workerURL: string = OwnOriginalSourceURL
	): Promise<InstanceType<T>> {
		return new Promise<InstanceType<T>>((resolve, reject) => {
			const backend = new Worker(workerURL);
			backend.onerror = e => {
				backend.onmessage = () => void 0;
				reject(e);
			};
			backend.onmessage = e => {
				console.assert(e.data === Commands.Ready, "Expected initial ready message!");
				backend.postMessage([
					Commands.Instantiate,
					(targetClass as any).constructor.__webfun_worker_class__
				]);
				backend.onmessage = e => {
					console.assert(e.data[0] === Commands.Instantiate, "Expected instantiation response!");
					const target = new targetClass();
					const proxy = new Proxy(target, new ProxyHandler(backend));

					resolve(proxy);
				};
			};
		});
	}
}
export default WebWorkerFactory;
