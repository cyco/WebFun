const contains = function <T>(candidate: T) {
	return !!~this.indexOf(candidate);
};

Array.prototype.contains = Array.prototype.contains || contains;

declare global {
	interface Array<T> {
		contains(item: T): boolean;
	}
}

export default Array.prototype.contains;
