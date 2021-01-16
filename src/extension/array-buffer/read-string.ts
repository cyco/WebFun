import { ArrayBuffer, Uint8Array } from "src/std";

const readString = function (offset: number = 0, length?: number): string {
	if (length === 0) return "";
	const buffer = new Uint8Array(this, offset, length || this.length);
	return String.fromCharCode.apply(null, buffer);
};

ArrayBuffer.prototype.readString = ArrayBuffer.prototype.readString || readString;

declare global {
	interface ArrayBuffer {
		readString(offset?: number, length?: number): string;
	}
}

export default readString;
