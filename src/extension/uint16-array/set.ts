const set = function(x: number, y: number, v: number) {
	this[x + y * 10] = v;
};

declare global {
	interface Uint16Array {
		set(x: number, y: number, v: number): void;
	}
	interface Int16Array {
		set(x: number, y: number, v: number): void;
	}
}

(Uint16Array.prototype as any).set = set;
(Int16Array.prototype as any).set = set;
export default Uint16Array.prototype.set;
