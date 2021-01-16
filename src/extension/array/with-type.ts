const withType = function <T>(searchType: T): any {
	return this.filter(({ type }: { type: T }) => type === searchType);
};

Array.prototype.withType = Array.prototype.withType || withType;

declare global {
	interface Array<T> {
		withType<E>(searchType: E): T[];
	}
}

export default withType;
