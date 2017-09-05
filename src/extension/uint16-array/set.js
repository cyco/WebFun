Uint16Array.prototype.set = Int16Array.prototype.set = function (x, y, v) {
	this[ x + y * 10 ] = v;
};
export default Uint16Array.prototype.set;
