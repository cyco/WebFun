const last = function () {
	return this.length ? this[this.length - 1] : null;
};
Array.prototype.last = Array.prototype.last || last;
export default last;
