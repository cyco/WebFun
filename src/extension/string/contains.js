const contains = function (something) {
	return this.indexOf(something) !== -1;
};

String.prototype.contains = String.prototype.contains || contains;
export default contains;
