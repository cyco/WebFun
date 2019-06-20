import { HotspotType, ZoneLayer } from "src/engine/objects";

import Engine from "../engine";
import { Tile, Hotspot } from "../objects";
import { NullIfMissing } from "src/engine/asset-manager";
import Zone from "../objects/zone";

class HotspotExecutor {
	private _engine: Engine;

	constructor(engine: Engine) {
		this._engine = engine;
	}

	laydownHotspotItems(zone: Zone): void {
		zone.hotspots.forEach(hotspot => this._laydownHotspotItem(zone, hotspot));
	}

	private _laydownHotspotItem(zone: Zone, hotspot: Hotspot): void {
		if (!hotspot.enabled) return;
		if (hotspot.arg === -1) return;

		const location = hotspot.location.clone();
		location.z = ZoneLayer.Object;

		const currentTile = zone.getTile(location);
		if (currentTile) return;

		const tile = this._engine.assetManager.get(Tile, hotspot.arg, NullIfMissing);

		const type = hotspot.type;
		if (type === HotspotType.SpawnLocation) {
			// TODO: grab puzzle NPC from world
			// if (hotspot.arg !== zone.puzzleNPC) console.warn("NPC ID mismatch");
			zone.setTile(tile, location);
		} else if (
			hotspot.type === HotspotType.TriggerLocation ||
			hotspot.type === HotspotType.CrateItem ||
			hotspot.type === HotspotType.CrateWeapon ||
			hotspot.type === HotspotType.ForceLocation
		) {
			zone.setTile(tile, location);
		} else return;

		// TODO: redraw location
		hotspot.enabled = false;
	}

	pickUpHotspotItems(zone: Zone) {
		zone.hotspots.forEach(hotspot => this._pickUpHotspotItem(zone, hotspot));
	}

	private _pickUpHotspotItem(_zone: Zone, _hotspot: Hotspot) {}
}

export default HotspotExecutor;
