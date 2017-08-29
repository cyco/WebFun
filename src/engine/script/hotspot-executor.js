import { HotspotType, ZoneLayer } from "/engine/objects";

class HotspotExecutor {
	constructor(engine) {
		this._engine = engine;
	}

	laydownHotspotItems(zone) {
		zone.hotspots.forEach((hotspot) => this._laydownHotspotItem(zone, hotspot));
	}

	_laydownHotspotItem(zone, hotspot) {
		if (!hotspot.enabled) return;
		if (hotspot.arg === -1) return;

		const location = hotspot.location.clone();
		location.z = ZoneLayer.Object;

		const currentTile = zone.getTile(location);
		if (currentTile) return;

		const tiles = this._engine.data.tiles;
		const tile = tiles[hotspot.arg];

		const type = hotspot.type;
		if (type === HotspotType.SpawnLocation) {
			if (hotspot.arg !== zone.puzzleNPC) console.warn("NPC ID mismatch");
			zone.set(tile, location);
		} else if ((hotspot.type === HotspotType.TriggerLocation)
			|| (hotspot.type === HotspotType.CrateItem)
			|| (hotspot.type === HotspotType.CrateWeapon)
			|| (hotspot.type === HotspotType.ForceLocation)) {
			zone.set(tile, location);
		} else return;

		// TODO: redraw location
		hotspot.enabled = false;
	}

	pickUpHotspotItems(zone) {
		zone.hotspots.forEach((hotspot) => this._pickUpHotspotItem(zone, hotspot));
	}

	_pickUpHotspotItem(zone, hotspot) {
	}
}

export default HotspotExecutor;
