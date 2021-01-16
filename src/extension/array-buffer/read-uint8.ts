import { ArrayBuffer, Uint8Array } from "src/std";

const readUint8 = function (offset: number): number {
	const buffer = new Uint8Array(this, offset, Uint8Array.BYTES_PER_ELEMENT);
	return buffer[0];
};

ArrayBuffer.prototype.readUint8 = ArrayBuffer.prototype.readUint8 || readUint8;

declare global {
	interface ArrayBuffer {
		readUint8(offset: number): number;
	}
}

export default readUint8;
