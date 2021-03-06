import { ColorPalette } from "src/engine";
import { Size } from "src/util";
import { Tile } from "src/engine/objects";
import drawImage from "./draw-image";

const size = new Size(Tile.WIDTH, Tile.HEIGHT);

export default (tile: Tile, palette: ColorPalette): ImageData => {
	if (!tile) return new ImageData(1, 1);

	return drawImage(tile.imageData, size, palette);
};
