import mapArray from "../map-array";

declare global {
	interface Int32Array {
		mapArray<T>(callbackfn: (value: number, index: number, array: Int32Array) => T): T[];
	}
}

Int32Array.prototype.mapArray = mapArray;
export default mapArray;
