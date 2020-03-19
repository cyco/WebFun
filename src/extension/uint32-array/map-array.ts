import mapArray from "../map-array";

declare global {
	interface Uint32Array {
		mapArray<T>(callbackfn: (value: number, index: number, array: Uint32Array) => T): T[];
	}
}

Uint32Array.prototype.mapArray = mapArray;
export default mapArray;
