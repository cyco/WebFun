import { floor } from "src/std/math";

function findColor(r: number, g: number, b: number, a: number = 255): number {
	if (a === 0) return 0;

	for (let i = 0; i < this.length; i += 4) {
		const value = this[i];
		if (
			r === ((value >> 16) & 0xff) &&
			g === ((value >> 8) & 0xff) &&
			b === (value & 0xff) &&
			(a === 255 && i !== 0)
		) {
			return floor(i / 4);
		}
	}

	return -1;
}

export default findColor;
