import { ColorPalette } from "src/engine";
import { Size } from "src/util";

export default (pixels: Uint8Array, { width, height }: Size, palette: ColorPalette) => {
	const result = new ImageData(width, height);

	const buffer = new ArrayBuffer(result.data.length);
	const byteArray = new Uint8Array(buffer);
	const data = new Uint32Array(buffer);

	for (let ty = 0; ty < height; ty++) {
		for (let tx = 0; tx < width; tx++) {
			const color = pixels[ty * width + tx];
			if (color !== 0) data[ty * width + tx] = palette[color];
		}
	}

	result.data.set(byteArray);
	return result;
};
