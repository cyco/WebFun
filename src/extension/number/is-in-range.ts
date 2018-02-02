const isInRange = function(start: number, end: number): boolean {
	return this >= start && this <= end;
};

Number.prototype.isInRange = Number.prototype.isInRange || isInRange;

declare global {
	interface Number {
		isInRange(start: number, end: number): boolean;
	}
}

export default isInRange;
