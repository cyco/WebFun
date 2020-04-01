const asString = function () {
	return String.fromCharCode.apply(null, this);
};

declare global {
	interface Uint8Array {
		asString(): string;
	}
}

Uint8Array.prototype.asString = asString;
export default asString;
