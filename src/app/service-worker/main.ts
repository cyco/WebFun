import Worker from "./service-worker";

const worker = new Worker((self as any) as ServiceWorkerGlobalScope);
worker.run();
