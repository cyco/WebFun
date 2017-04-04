Array.prototype.insert = function(pos, item) {
	this.splice(pos, 0, item);
};
export default Array.prototype.insert;