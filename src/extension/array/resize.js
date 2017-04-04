Array.prototype.resize = function(targetSize, element) {
	this.splice(0, this.length);
	for (let i = 0; i < targetSize; i++) {
		this.push(element);
	}
};
export default Array.prototype.resize;