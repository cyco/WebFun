import { Engine } from "src/engine";
import { Zone, Tile } from "src/engine/objects";
import { Point } from "src/util";
import { NullIfMissing } from "src/engine/asset-manager";

function ZoneSetTileAt(engine: Engine, zone: Zone, pos: Point, tileId: number): any {
	const tile = engine.assetManager.get(Tile, tileId, NullIfMissing);
	zone.setTile(tile, pos.x, pos.y, Zone.Layer.Object);
}

export default ZoneSetTileAt;
