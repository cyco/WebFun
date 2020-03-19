import mapArray from "../map-array";

declare global {
	interface Int16Array {
		mapArray<T>(callbackfn: (value: number, index: number, array: Int16Array) => T): T[];
	}
}

Int16Array.prototype.mapArray = mapArray;
export default mapArray;
