const some = function <T>(predicate: (item: T) => boolean): boolean {
	return [...this.values()].some(predicate);
};

Set.prototype.some = Set.prototype.some || some;

declare global {
	interface Set<T> {
		some(predicate: (item: T) => boolean): boolean;
	}
}

export default some;
