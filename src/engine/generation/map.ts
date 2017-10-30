type Map = Uint16Array;

declare interface Uint16Array {
	readonly length: number;

	set(x: number, y: number, value: number): void;

	get(x: number, y: number): number;

	[_: number]: number;
}

export default Map;
