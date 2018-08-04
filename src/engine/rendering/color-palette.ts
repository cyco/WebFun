import { floor } from "src/std.math";

interface ColorPalette extends Uint8Array {
	findColor(r: number, g: number, b: number, a?: number): number;
	toGIMP(name: string): string;
}

function findColor(r: number, g: number, b: number, a: number = 255): number {
	for (let i = 0; i < this.length; i += 4) {
		if (r === this[i + 0] && g === this[i + 1] && b === this[i + 2] && a === this[i + 3]) {
			return floor(i / 3);
		}
	}

	return -1;
}

function toGIMP(name: string): string {
	let out: string = "";

	out += `GIMP Palette` + "\n";
	out += `Name: ${name}` + "\n";
	out += `#` + "\n";

	console.log("size: ", this.length);
	for (let i = 0; i < this.length; i += 4) {
		out +=
			`${this[i + 2]} ${this[i + 1]} ${this[i + 0]}${i === 0 ? " transparent" : ""}` + "\n";
	}

	return out;
}

Uint8Array.prototype.findColor = Uint8Array.prototype.findColor || findColor;
Uint8Array.prototype.toGIMP = Uint8Array.prototype.toGIMP || toGIMP;

export default ColorPalette;
