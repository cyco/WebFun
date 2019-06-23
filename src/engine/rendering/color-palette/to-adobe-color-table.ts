import { OutputStream } from "src/util";
import { floor } from "src/std/math";

function toAdobeColorTable(transparentColorIndex: number = 0): Uint8Array {
	const stream = new OutputStream(this.length * 3 + 2 + 2);
	for (let i = 0; i < this.length; i++) {
		const value = this[i];

		stream.writeUint8((value >> 16) & 0xff);
		stream.writeUint8((value >> 8) & 0xff);
		stream.writeUint8(value & 0xff);
	}
	stream.endianess = OutputStream.ENDIAN.BIG;
	stream.writeUint16(floor(this.length / 4));
	stream.writeUint16(transparentColorIndex);

	return new Uint8Array(stream.buffer);
}

export default toAdobeColorTable;
