import { ArrayBuffer, Uint16Array } from "src/std";

const readUint16 = function(offset: number) {
	let buffer;
	if (offset % Uint16Array.BYTES_PER_ELEMENT !== 0)
		buffer = new Uint16Array(this.slice(offset, offset + Uint16Array.BYTES_PER_ELEMENT));
	else buffer = new Uint16Array(this, offset, Uint16Array.BYTES_PER_ELEMENT);

	return buffer[0];
};

ArrayBuffer.prototype.readUint16 = ArrayBuffer.prototype.readUint16 || readUint16;

declare global {
	interface ArrayBuffer {
		readUint16(offset: number): number;
	}
}

export default readUint16;
