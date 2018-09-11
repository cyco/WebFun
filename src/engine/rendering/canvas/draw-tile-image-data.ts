import { Tile } from "src/engine/objects";
import { ColorPalette } from "src/engine";
import { Size } from "src/util";
import drawImage from "./draw-image";

const size = new Size(Tile.WIDTH, Tile.HEIGHT);

export default (tile: Tile, palette: ColorPalette) => {
	if (!tile) return new ImageData(1, 1);

	return drawImage(tile.imageData, size, palette);
};
