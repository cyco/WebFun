Number.prototype.isInRange = Number.prototype.isInRange || function (start, end) {
	return this >= start && this <= end;
};

export default Number.prototype.isInRange;
