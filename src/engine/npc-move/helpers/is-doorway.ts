import { Engine } from "src/engine";
import { Tile } from "src/engine/objects";
import { NullIfMissing } from "src/engine/asset-manager";

export default (engine: Engine, tileId: number): boolean => {
	const tile = engine.assetManager.get(Tile, tileId, NullIfMissing);
	return tile && tile.isDoorway();
};
