Number.prototype.times = Number.prototype.times || function(fn) {
	const result = new Array(this);
	for (let i = 0; i < this; i++) {
		result[i] = fn(i);
	}
	return result;
};

export default Number.prototype.times;
