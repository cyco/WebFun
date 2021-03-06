import { floor, max, min, round } from "src/std/math";

const rgba = (r: number, g: number, b: number, a: number): string => `rgba(${r},${g},${b},${a})`;
const rgb = (r: number, g: number, b: number): string => `rgb(${r},${g},${b})`;

const rgbf2rgbi = (...args: number[]): number[] => args.map(i => round(i * 255.0));
const rgb2rgba = (...args: number[]): number[] => [...args, 1];

const hsv2rgb = (h: number, s: number, v: number): number[] => {
	h = h % 360;
	while (h < 0) {
		h += 360;
	}

	const b = (1 - s) * v;
	const vb = v - b;
	const hm = h % 60;
	switch (floor(h / 60)) {
		case 0:
			return rgbf2rgbi(v, (vb * h) / 60 + b, b);
		case 1:
			return rgbf2rgbi((vb * (60 - hm)) / 60 + b, v, b);
		case 2:
			return rgbf2rgbi(b, v, (vb * hm) / 60 + b);
		case 3:
			return rgbf2rgbi(b, (vb * (60 - hm)) / 60 + b, v);
		case 4:
			return rgbf2rgbi((vb * hm) / 60 + b, b, v);
		case 5:
			return rgbf2rgbi(v, b, (vb * (60 - hm)) / 60 + b);
	}
};

const rgb2hsv = (r: number, g: number, b: number): [number, number, number] => {
	[r, g, b] = [r, g, b].map(v => v / 255);

	const minV = min(r, g, b);
	const maxV = max(r, g, b);

	if (minV === maxV) return [0, 0, minV];

	const d = r === minV ? g - b : b === minV ? r - g : b - r;
	const h = r === minV ? 3 : b === minV ? 1 : 5;
	return [60 * (h - d / (maxV - minV)), (maxV - minV) / maxV, maxV];
};
export { rgba, rgb, rgb2rgba, hsv2rgb, rgb2hsv };

const HexRegex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const RGBRegex = /^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
const RGBARegex = /^rgba\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(\.\d+)?)\s*\)$/i;
const HSVRegex = /^hsv\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;

class Color {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _alpha: number;

	static FromHSV(h: number, s: number, v: number): Color {
		const [r, g, b] = hsv2rgb(h, s, v);
		return new Color(r, g, b);
	}

	constructor(red: number | string | Color, green?: number, blue?: number, alpha: number = 1.0) {
		if (typeof red === "string") {
			[red, green, blue, alpha] = this._parseColor(red as string);
		}

		if (red instanceof Color) {
			[red, green, blue, alpha] = red.rgbaComponents;
		}

		if (red === null) {
			[red, green, blue, alpha] = [0, 0, 0, 1];
		}

		this._red = red as number;
		this._green = green;
		this._blue = blue;
		this._alpha = alpha;
	}

	private _parseColor(c: string): [number, number, number, number] {
		c = c.toLowerCase();

		let matches = HexRegex.exec(c);
		if (matches)
			return [
				parseInt(matches[1], 0x10),
				parseInt(matches[2], 0x10),
				parseInt(matches[3], 0x10),
				1
			];

		matches = RGBRegex.exec(c);
		if (matches) {
			return [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), 1];
		}

		matches = RGBARegex.exec(c);
		if (matches) {
			return [
				parseInt(matches[1]),
				parseInt(matches[2]),
				parseInt(matches[3]),
				parseFloat(matches[4])
			];
		}

		matches = HSVRegex.exec(c);
		if (matches) {
			const [h, s, v] = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3])];
			const [r, g, b] = hsv2rgb(h, s, v);
			return [r, g, b, 1];
		}

		throw new Error(`Unable to read color from "${c}".`);
	}

	get rgbComponents(): [number, number, number] {
		return [this._red, this._green, this._blue];
	}

	get rgbaComponents(): [number, number, number, number] {
		return [this._red, this._green, this._blue, this._alpha];
	}

	get hsvComponents(): [number, number, number] {
		return rgb2hsv(this._red, this._green, this._blue);
	}

	public toString(): string {
		return rgba(this._red, this._green, this._blue, this._alpha);
	}
}

export default Color;
