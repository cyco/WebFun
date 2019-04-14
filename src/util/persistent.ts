import { localStorage } from "src/std/dom";

function persistent<T extends object>(object: T, prefix: string = null, storage: Storage = localStorage): T {
	const buildKey = (k: string) => (prefix ? `${prefix}.${k}` : k);

	return new Proxy(object, {
		get(target: T, p: PropertyKey, _: any): any {
			if (typeof p === "string")
				return storage.has(buildKey(p)) ? storage.load(buildKey(p)) : (target as any)[p];
			return (target as any)[p];
		},

		set(target: T, p: PropertyKey, value: any, _: any): boolean {
			if (typeof p === "string") storage.store(buildKey(p), value);
			else (target as any)[p] = value;
			return true;
		}
	});
}

export default persistent;
