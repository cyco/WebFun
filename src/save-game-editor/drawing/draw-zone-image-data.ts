import { Zone, Tile } from "src/engine/objects";
import { ColorPalette } from "src/engine";

export default (zone: Zone, palette: ColorPalette) => {
	if (!zone) return new ImageData(1, 1);

	const TileWidth = Tile.WIDTH;
	const TileHeight = Tile.HEIGHT;
	const ZoneWidth = zone.size.width;
	const ZoneHeight = zone.size.height;

	const imageData = new ImageData(ZoneWidth * TileWidth, ZoneHeight * TileHeight);
	const rawImageData = imageData.data;

	const bpr = 4 * ZoneWidth * TileWidth;

	for (let y = 0; y < ZoneHeight; y++) {
		for (let x = 0; x < ZoneWidth; x++) {
			for (let z = 0; z < Zone.LAYERS; z++) {
				let tile = zone.getTile(x, y, z);
				if (!tile) continue;

				const pixels = tile.imageData;
				const sy = y * TileHeight;
				const sx = x * TileWidth;
				let j = sy * bpr + sx * 4;

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
			}
		}
	}

	return imageData;
};
