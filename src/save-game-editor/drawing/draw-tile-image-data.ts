import { Tile } from "src/engine/objects";
import { ColorPalette } from "src/engine";

export default (tile: Tile, palette: ColorPalette) => {
	if (!tile) return new ImageData(1, 1);

	const TileWidth = Tile.WIDTH;
	const TileHeight = Tile.HEIGHT;

	const imageData = new ImageData(TileWidth, TileHeight);
	const rawImageData = imageData.data;

	const bpr = 4 * TileWidth;
	const pixels = tile.imageData;
	let j = 0;
	for (let ty = 0; ty < TileHeight; ty++) {
		for (let tx = 0; tx < TileWidth; tx++) {
			const i = ty * TileWidth + tx;
			const paletteIndex = pixels[i] * 4;
			if (paletteIndex === 0) continue;

			rawImageData[j + 4 * tx + 0] = palette[paletteIndex + 2];
			rawImageData[j + 4 * tx + 1] = palette[paletteIndex + 1];
			rawImageData[j + 4 * tx + 2] = palette[paletteIndex + 0];
			rawImageData[j + 4 * tx + 3] = paletteIndex === 0 ? 0x00 : 0xff;
		}

		j += bpr;
	}

	return imageData;
};
