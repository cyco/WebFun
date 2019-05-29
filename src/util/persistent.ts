import { localStorage } from "src/std/dom";

function persistent<T extends object>(object: T, prefix: string = null, storage: Storage = localStorage): T {
	const buildKey = (k: string) => (prefix ? `${prefix}.${k}` : k);

	return new Proxy(object, {
		get(target: T, p: PropertyKey, _: any): any {
			console.assert(typeof p === "string");
			const key = p as string;
			return storage.has(buildKey(key)) ? storage.load(buildKey(key)) : (target as any)[key];
		},

		set(target: T, p: PropertyKey, value: any, _: any): boolean {
			console.assert(typeof p === "string");
			const key = p as string;
			storage.store(buildKey(key), value);
			(target as any)[key] = value;
			return true;
		}
	});
}

export default persistent;
