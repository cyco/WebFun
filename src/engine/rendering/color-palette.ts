import { floor } from "src/std.math";
import { OutputStream } from "src/util";

interface ColorPalette extends Uint8Array {
	findColor(r: number, g: number, b: number, a?: number): number;
	toGIMP(name: string): string;
	toAdobeColorTable(): Uint8Array;
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

Uint8Array.prototype.findColor = Uint8Array.prototype.findColor || findColor;
Uint8Array.prototype.toGIMP = Uint8Array.prototype.toGIMP || toGIMP;
Uint8Array.prototype.toAdobeColorTable = Uint8Array.prototype.toAdobeColorTable || toAdobeColorTable;

export default ColorPalette;
