import mapArray from "../map-array";

declare global {
	interface Uint8Array {
		mapArray<T>(cb: (value: number, index: number, array: Uint8Array) => T): T[];
	}
}

Uint8Array.prototype.mapArray = mapArray;
export default mapArray;
