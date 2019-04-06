const times = function<T>(fn: (i: number) => T): T[] {
	const result = new Array(this);
	for (let i = 0; i < this; i++) {
		result[i] = fn(i);
	}
	return result;
};

Number.prototype.times = Number.prototype.times || times;

declare global {
	interface Number {
		times<T>(callback: (i: number) => T): T[];
	}
}

export default times;
