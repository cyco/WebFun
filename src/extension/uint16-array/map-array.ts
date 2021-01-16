import mapArray from "../map-array";

declare global {
	interface Uint16Array {
		mapArray<T>(cb: (value: number, index: number, array: Uint16Array) => T): T[];
	}
}

Uint16Array.prototype.mapArray = mapArray;
export default mapArray;
