import mapArray from "../map-array";

declare global {
	interface Int8Array {
		mapArray<T>(callbackfn: (value: number, index: number, array: Int8Array) => T): T[];
	}
}

Int8Array.prototype.mapArray = mapArray;
export default mapArray;
