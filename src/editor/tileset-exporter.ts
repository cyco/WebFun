import { ColorPalette } from "src/engine";
import { Tile, Zone } from "src/engine/objects";
import { Size, downloadImage } from "src/util";
import { ceil } from "src/std/math";
import { drawZoneImageData } from "src/app/rendering";
import { MutableZone } from "src/engine/mutable-objects";

class TilemapExporter {
	private colorPalette: ColorPalette;
	constructor(colorPalette: ColorPalette) {
		this.colorPalette = colorPalette;
	}

	export(tiles: Tile[], filename: string): void {
		const zone = new MutableZone();
		zone.tileStore = tiles;
		zone.size = this.findFittingSize(tiles.length);
		zone.tileIDs = new Int16Array(zone.size.width * zone.size.height * Zone.LAYERS);
		zone.tileIDs.fill(-1);
		for (let i = 0; i < tiles.length; i++) {
			zone.tileIDs[i * 3] = tiles[i].id;
		}

		const imageData = drawZoneImageData(zone, this.colorPalette);
		return downloadImage(imageData, filename, "image/png");
	}

	private findFittingSize(count: number): Size {
		const width = 21; //floor(sqrt(count));
		const height = ceil(count / width);

		return new Size(width, height);
	}
}

export default TilemapExporter;
