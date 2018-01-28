const contains = function(something: string): boolean {
	return this.indexOf(something) !== -1;
};

String.prototype.contains = String.prototype.contains || contains;

declare global {
	interface String {
		contains(needle: string): boolean;
	}
}

export default contains;
