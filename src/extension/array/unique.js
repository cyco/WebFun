Array.prototype.unique = function () {
	return this.sort().filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
};
export default Array.prototype.unique;
