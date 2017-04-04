Array.prototype.contains = Array.prototype.contains || function(candidate) {
	return this.indexOf(candidate) !== -1;
};

export default Array.prototype.contains;