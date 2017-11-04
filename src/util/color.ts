const rgba = (r: number, g: number, b: number, a: number): string => `rgba(${r},${g},${b},${a})`;
const rgb = (r: number, g: number, b: number): string => `rgb(${r},${g},${b})`;

const rgbf2rgbi = (...args: number[]): number[] => args.map(i => Math.round(i * 255.0));
const rgb2rgba = (...args: number[]): number[] => [...args, 1];

const hsv2rgb = (h: number, s: number, v: number): number[] => {
	h = h % 360;

	const b = ((1 - s) * v);
	const vb = v - b;
	const hm = h % 60;
	switch(Math.floor(h/60)) {
		case 0:	return rgbf2rgbi(v, vb * h / 60 + b, b);
		case 1: return rgbf2rgbi(vb * (60 - hm) / 60 + b, v, b);
		case 2: return rgbf2rgbi(b, v, vb * hm / 60 + b);
		case 3: return rgbf2rgbi(b, vb * (60 - hm) / 60 + b, v);
		case 4: return rgbf2rgbi(vb * hm / 60 + b, b, v);
		case 5: return rgbf2rgbi(v, b, vb * (60 - hm) / 60 + b);
		default: debugger;
	}
};

const rgb2hsv = (r: number, g: number, b: number): [number, number, number] => {
	[r, g, b] = [r, g, b].map(v => v / 255);

	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);

	if (min === max)
		return [0, 0, min];

	const d = (r === min) ? g - b : (b === min ? r - g : b - r);
	const h = (r === min) ? 3 : (b === min ? 1 : 5);
	return [60 * (h - d / (max - min)), (max - min) / max, max];
};

export { rgba, rgb, rgb2rgba, hsv2rgb, rgb2hsv };
