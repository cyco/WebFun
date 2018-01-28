const each = function<T>(callback: ((key: string, value: T) => void)): void {
	for (let key in this) {
		if (!this.hasOwnProperty(key)) continue;
		callback(key, this[key]);
	}
};

Object.defineProperty(Object.prototype, "each", {
	value: each,
	writable: true,
	enumerable: false,
	configurable: true
});

export default each;
