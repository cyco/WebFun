const ensureTail = function (tail: string): string {
	if (this.endsWith(tail)) return this;
	return this + tail;
};

String.prototype.ensureTail = String.prototype.ensureTail || ensureTail;

declare global {
	interface String {
		ensureTail(tail: string): string;
	}
}

export default ensureTail;
