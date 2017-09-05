Uint16Array.prototype.get = Int16Array.prototype.get = function (x, y) {
	if (x < 0 || x > 9 || y < 0 || y > 9) return -1;
	return this[ x + y * 10 ];
};
export default Uint16Array.prototype.get;
