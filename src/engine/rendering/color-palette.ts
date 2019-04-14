import OutputStream from "src/util/output-stream";
import { floor } from "src/std/math";

interface ColorPalette extends Uint32Array {
	slice(start?: number, end?: number): ColorPalette;
	findColor(r: number, g: number, b: number, a?: number): number;
	toGIMP(name: string): string;
	toAdobeColorTable(): Uint8Array;
}

declare global {
	interface Uint32ArrayConstructor {
		paletteFromUint8Array(bytes: Uint8Array): ColorPalette;
		paletteFromArrayBuffer(buffer: ArrayBuffer): ColorPalette;
	}
}

function findColor(r: number, g: number, b: number, a: number = 255): number {
	if (a == 0) return 0;

	for (let i = 0; i < this.length; i += 4) {
		const value = this[i];
		if (
			r === ((value >> 16) & 0xff) &&
			g === ((value >> 8) & 0xff) &&
			b === (value & 0xff) &&
			(a === 255 && i != 0)
		) {
			return floor(i / 4);
		}
	}

	return -1;
}

function toGIMP(name: string): string {
	let out = "";

	out += `GIMP Palette` + "\n";
	out += `Name: ${name}` + "\n";
	out += `#` + "\n";

	for (let i = 0; i < this.length; i++) {
		const value = this[i];

		out +=
			`${(value >> 16) & 0xff} ${(value >> 8) & 0xff} ${value & 0xff}${i === 0 ? " transparent" : ""}` +
			"\n";
	}

	return out;
}

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

function paletteFromUint8Array(arr: Uint32Array): ColorPalette {
	const colorPalette = new Uint32Array(0x100) as ColorPalette;

	for (let i = 0; i < 0x100; i++) {
		colorPalette[i] =
			((i === 0 ? 0 : 0xff) << 24) | // alpha
			(arr[i * 4 + 0] << 16) | // blue
			(arr[i * 4 + 1] << 8) | // green
			arr[i * 4 + 2]; // red
	}

	return colorPalette;
}

function paletteFromArrayBuffer(buffer: ArrayBuffer): ColorPalette {
	const arr = new Uint8Array(buffer);
	return this.paletteFromUint8Array(arr);
}

const proto = Uint32Array.prototype as ColorPalette;
const constructor = Uint32Array as any;

proto.findColor = proto.findColor || findColor;
proto.toGIMP = proto.toGIMP || toGIMP;
proto.toAdobeColorTable = proto.toAdobeColorTable || toAdobeColorTable;
constructor.paletteFromUint8Array = constructor.paletteFromUint8Array || paletteFromUint8Array;
constructor.paletteFromArrayBuffer = constructor.paletteFromArrayBuffer || paletteFromArrayBuffer;

export default ColorPalette;
