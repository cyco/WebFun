Array.prototype.contains = Array.prototype.contains || function (candidate) {
		return !!~this.indexOf(candidate);
	};

export default Array.prototype.contains;
