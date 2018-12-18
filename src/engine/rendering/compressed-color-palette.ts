import { floor } from "src/std/math";
import { OutputStream } from "src/util";
import ColorPalette from "./color-palette";

interface CompressedColorPalette extends Uint8Array {
	findColor(r: number, g: number, b: number, a?: number): number;
	toGIMP(name: string): string;
	toAdobeColorTable(): Uint8Array;
	decompress(): ColorPalette;
	slice(start?: number, end?: number): CompressedColorPalette;
}

function findColor(r: number, g: number, b: number, a: number = 255): number {
	if (a == 0) return 0;

	for (let i = 0; i < this.length; i += 4) {
		if (r === this[i + 2] && g === this[i + 1] && b === this[i + 0] && (a === 255 && i != 0)) {
			return floor(i / 4);
		}
	}

	return -1;
}

function toGIMP(name: string): string {
	let out: string = "";

	out += `GIMP Palette` + "\n";
	out += `Name: ${name}` + "\n";
	out += `#` + "\n";

	for (let i = 0; i < this.length; i += 4) {
		out += `${this[i + 2]} ${this[i + 1]} ${this[i + 0]}${i === 0 ? " transparent" : ""}` + "\n";
	}

	return out;
}

function toAdobeColorTable(transparentColorIndex: number = 0): Uint8Array {
	const stream = new OutputStream((this.length / 4) * 3 + 2 + 2);
	for (let i = 0; i < this.length; i += 4) {
		stream.writeUint8(this[i + 2]);
		stream.writeUint8(this[i + 1]);
		stream.writeUint8(this[i]);
	}
	stream.endianess = OutputStream.ENDIAN.BIG;
	stream.writeUint16(floor(this.length / 4));
	stream.writeUint16(transparentColorIndex);

	return new Uint8Array(stream.buffer);
}

function decompress(): ColorPalette {
	const colorPalette = new Uint32Array(0x100);

	for (let i = 0; i < 0x100; i++) {
		colorPalette[i] =
			((i === 0 ? 0 : 0xff) << 24) | // alpha
			(this[i * 4 + 0] << 16) | // blue
			(this[i * 4 + 1] << 8) | // green
			this[i * 4 + 2]; // red
	}

	return colorPalette;
}

const proto = Uint8Array.prototype as any;
proto.findColor = proto.findColor || findColor;
proto.toGIMP = proto.toGIMP || toGIMP;
proto.toAdobeColorTable = proto.toAdobeColorTable || toAdobeColorTable;
proto.decompress = proto.decompress || decompress;

export default CompressedColorPalette;
