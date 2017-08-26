Array.prototype.clear = Array.prototype.clear || function () {
	this.splice(0, this.length);
};

export default Array.prototype.clear;
