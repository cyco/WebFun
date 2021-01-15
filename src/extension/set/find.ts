const find = function <T>(predicate: (item: T) => boolean): T {
	return [...this.values()].find(predicate);
};

Set.prototype.find = Set.prototype.find || find;

declare global {
	interface Set<T> {
		find(predicate: (item: T) => boolean): T;
	}
}

export default find;
