import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, hotspot: Hotspot): HotspotExecutionResult => {
	const zone = engine.currentZone;
	const tile = zone.getTile(hotspot.x, hotspot.y, Zone.Layer.Object);
	if (!tile) return HotspotExecutionResult.Void;
	if (tile.id !== hotspot.argument) return HotspotExecutionResult.Void;

	zone.setTile(null, hotspot.location.x, hotspot.location.y, Zone.Layer.Object);
	engine.dropItem(tile, hotspot.location).then(() => {
		if (hotspot.type === Hotspot.Type.DropQuestItem) {
			const { sector } = engine.findSectorContainingZone(zone);
			console.assert(!!sector);
			sector.solved1 = true;
			sector.solved2 = true;
		}
	});
	hotspot.enabled = false;

	return HotspotExecutionResult.Drop;
};
