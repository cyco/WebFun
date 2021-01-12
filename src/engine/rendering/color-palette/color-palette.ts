import { floor } from "src/std/math";
import toGIMP from "./to-gimp";
import toAdobeColorTable from "./to-adobe-color-table";

interface ColorPalette extends Uint32Array {
	slice(start?: number, end?: number): ColorPalette;
}

class ColorPalette extends Uint32Array {
	[index: number]: number;

	public static FromBGR8Buffer(buffer: ArrayBuffer | SharedArrayBuffer): ColorPalette {
		const arr = new Uint8Array(buffer);
		return this.FromBGR8(arr);
	}

	public static FromBGR8(buffer: Uint8Array, bpc: number = 4): ColorPalette {
		// Convert buffer from bytewise BB GG RR 00 ... to double word 0xAA BB GG RR (little endian RGBA) array
		const length = floor(buffer.length / 4);
		const colorPalette = new Uint32Array(length);

		// Color at index 0 is transparent, handle special case outside of loop to improve performance
		colorPalette[0] = (buffer[0] << 16) | (buffer[1] << 8) | buffer[2];

		for (let i = 1; i < length; i++) {
			colorPalette[i] =
				(0xff << 24) |
				(buffer[i * bpc + 0] << 16) |
				(buffer[i * bpc + 1] << 8) |
				buffer[i * bpc + 2];
		}

		return this.Create(colorPalette);
	}

	private static Create(palette: Uint32Array): ColorPalette {
		// HACK: In order to support array syntax (e.g. palette[5]) without performance penalties we just insert
		// ColorPalette into the prototype chain of the existing Uint32Array.
		// Usage of __proto__ is non-standard and will break in the future.
		(palette as any).__proto__ = ColorPalette.prototype;
		return (palette as any) as ColorPalette;
	}

	public slice(start?: number, end?: number): ColorPalette {
		const result = Uint32Array.prototype.slice.call(this, start, end);
		return ColorPalette.Create(result);
	}

	public findColor(r: number, g: number, b: number, a: number = 255): number {
		if (a === 0) return 0;

		// HACK: Send needle through Uint32Array to get unsigned value for comparison
		const needle = new Uint32Array([(0xff << 24) | (b << 16) | (g << 8) | r])[0];
		for (let i = 1; i < this.length; i++) {
			if (this[i] === needle) return i;
		}

		return -1;
	}

	public toGIMP(name: string): string {
		return toGIMP(this, name);
	}

	public toAdobeColorTable(): Uint8Array {
		return toAdobeColorTable(this);
	}
}

export default ColorPalette;
