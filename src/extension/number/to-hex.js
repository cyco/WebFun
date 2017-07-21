const toHex = function (length = 0) {
	return `0x${this.toString(0x10).padStart(length, "0")}`;
};

Number.prototype.toHex = Number.prototype.toHex || toHex;
export default toHex;
