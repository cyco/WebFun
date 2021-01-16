import { ArrayBuffer, Uint32Array } from "src/std";

const readUint32 = function (offset: number): number {
	let buffer;
	if (offset % Uint32Array.BYTES_PER_ELEMENT !== 0)
		buffer = new Uint32Array(this.slice(offset, offset + Uint32Array.BYTES_PER_ELEMENT));
	else buffer = new Uint32Array(this, offset, 1);

	return buffer[0];
};

ArrayBuffer.prototype.readUint32 = ArrayBuffer.prototype.readUint32 || readUint32;

declare global {
	interface ArrayBuffer {
		readUint32(offset: number): number;
	}
}

export default readUint32;
