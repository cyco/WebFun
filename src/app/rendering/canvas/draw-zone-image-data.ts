import { Tile, Zone } from "src/engine/objects";

import { ColorPalette } from "src/engine";

export default (zone: Zone, palette: ColorPalette): ImageData => {
	if (!zone) return new ImageData(1, 1);

	const TileWidth = Tile.WIDTH;
	const TileHeight = Tile.HEIGHT;
	const ZoneWidth = zone.size.width;
	const ZoneHeight = zone.size.height;

	const result = new ImageData(ZoneWidth * TileWidth, ZoneHeight * TileHeight);
	var buffer = new ArrayBuffer(result.data.length);
	var byteArray = new Uint8Array(buffer);
	var data = new Uint32Array(buffer);

	const bpr = ZoneWidth * TileWidth;

	for (let y = 0; y < ZoneHeight; y++) {
		for (let x = 0; x < ZoneWidth; x++) {
			for (let z = 0; z < Zone.LAYERS; z++) {
				const tile = zone.getTile(x, y, z);
				if (!tile) continue;

				const pixels = tile.imageData;
				const sy = y * TileHeight;
				const sx = x * TileWidth;
				let j = sy * bpr + sx;

				for (let ty = 0; ty < TileHeight; ty++) {
					for (let tx = 0; tx < TileWidth; tx++) {
						const i = ty * TileWidth + tx;
						const paletteIndex = pixels[i];
						if (paletteIndex === 0) continue;

						data[j + tx] = palette[paletteIndex];
					}

					j += bpr;
				}
			}
		}
	}
	result.data.set(byteArray);

	return result;
};
