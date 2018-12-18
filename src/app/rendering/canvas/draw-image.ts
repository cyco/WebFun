import { CompressedColorPalette } from "src/engine";
import { Size } from "src/util";

export default (pixels: Uint8Array, { width, height }: Size, palette: CompressedColorPalette) => {
	const result = new ImageData(width, height);
	const raw = result.data;

	const bpr = 4 * width;
	let j = 0;
	for (let ty = 0; ty < height; ty++) {
		for (let tx = 0; tx < width; tx++) {
			const colorIndex = pixels[ty * width + tx] * 4;
			if (colorIndex === 0) continue;

			raw[j + 4 * tx + 0] = palette[colorIndex + 2];
			raw[j + 4 * tx + 1] = palette[colorIndex + 1];
			raw[j + 4 * tx + 2] = palette[colorIndex + 0];
			raw[j + 4 * tx + 3] = colorIndex === 0 ? 0x00 : 0xff;
		}

		j += bpr;
	}

	return result;
};
