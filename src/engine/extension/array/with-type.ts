const withType = function <T>(searchType: T) {
	return this.filter(({ type }: { type: T }) => type === searchType);
};

Array.prototype.withType = withType;

declare global {
	interface Array<T> {
		withType<E>(searchType: E): Array<T>
	}
}

export default withType;
