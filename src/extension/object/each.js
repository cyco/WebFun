const each = function (callback) {
	for (let key in this) {
		callback(key, this[key]);
	}
};

if (!Object.prototype.each) {
	Object.defineProperty(Object.prototype, "each", {
		value: each,
		writable: true,
		enumerable: false,
		configurable: true
	});
}

export default each;
