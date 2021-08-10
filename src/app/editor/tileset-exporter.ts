import { AssetManager, ColorPalette } from "src/engine";
import { Tile, Zone } from "src/engine/objects";
import { Size, downloadImage } from "src/util";
import { ceil } from "src/std/math";
import { drawZoneImageData } from "src/app/webfun/rendering";

class TilesetExporter {
	private colorPalette: ColorPalette;
	constructor(colorPalette: ColorPalette) {
		this.colorPalette = colorPalette;
	}

	export(tiles: Tile[], filename: string): Promise<void> {
		const assets = new AssetManager();
		assets.populate(Tile, tiles);

		const size = this.findFittingSize(tiles.length);
		const zone = new Zone(
			0,
			{
				zoneType: Zone.Type.None.rawValue,
				planet: Zone.Planet.None.rawValue,

				width: size.width,
				height: size.height,
				providedItemIDs: new Int16Array(),
				goalItemIDs: new Int16Array(),
				npcIDs: new Int16Array(),
				requiredItemIDs: new Int16Array(),

				monsters: [],
				hotspots: [],
				actions: [],

				unknown: -1,
				tileIDs: new Int16Array(size.width * size.height * Zone.LAYERS)
			},
			assets
		);
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

export default TilesetExporter;
