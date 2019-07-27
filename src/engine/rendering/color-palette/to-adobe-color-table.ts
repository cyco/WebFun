import { OutputStream } from "src/util";
import { floor } from "src/std/math";

function toAdobeColorTable(buffer: Uint32Array, transparentColorIndex: number = 0): Uint8Array {
	const length = buffer.length;
	const stream = new OutputStream(length * 3 + 2 + 2);
	for (let i = 0; i < length; i++) {
		const value = buffer[i];

		stream.writeUint8((value >> 16) & 0xff);
		stream.writeUint8((value >> 8) & 0xff);
		stream.writeUint8(value & 0xff);
	}
	stream.endianess = OutputStream.Endian.Big;
	stream.writeUint16(floor(length / 4));
	stream.writeUint16(transparentColorIndex);

	return new Uint8Array(stream.buffer);
}

export default toAdobeColorTable;
