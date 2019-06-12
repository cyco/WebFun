import { ArrayBuffer, Uint8Array } from "src/std";

const readString = function(offset: number, length: number) {
	if (length === 0) return "";
	const buffer = new Uint8Array(this, offset, length);
	return String.fromCharCode.apply(null, buffer);
};

ArrayBuffer.prototype.readString = ArrayBuffer.prototype.readString || readString;

declare global {
	interface ArrayBuffer {
		readString(): string;
	}
}

export default readString;
