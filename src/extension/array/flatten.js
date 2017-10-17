const flatten = function () {
	return Array.prototype.concat.apply([], this);
};

Array.prototype.flatten = Array.prototype.flatten || flatten;
export default flatten;
