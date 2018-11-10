import { dispatch } from "src/util";
import { Tile } from "src/engine/objects";
import { AbstractImageFactory } from "src/engine/rendering";

const TileImageBatchSize = 100;

class TileImageLoader {
	public load(tiles: Tile[], imageFactory: AbstractImageFactory, progress: Function, load: Function) {
		const tileHeight = Tile.HEIGHT;
		const tileWidth = Tile.WIDTH;
		const tileCount = tiles.length;

		imageFactory.prepare(tileCount);

		const loadBatch = async (idx: number) => {
			const max = Math.min(idx + TileImageBatchSize, tileCount);
			for (; idx < max; idx++) {
				const tile = tiles[idx];
				tile.image = await imageFactory.buildImage(tileWidth, tileHeight, tile.imageData);
				if (tile.image && tile.name) tile.image.representation.title = tile.name;
				progress(5, 4 * (idx / tileCount));
			}
		};

		const loadTileImage = async (idx: number) => {
			if (idx >= tileCount) {
				imageFactory.finalize();
				progress(9, 1);
				load();
				return;
			}

			await loadBatch(idx);

			dispatch(() => loadTileImage(idx + TileImageBatchSize));
		};

		loadTileImage(0);
	}
}

export default TileImageLoader;
