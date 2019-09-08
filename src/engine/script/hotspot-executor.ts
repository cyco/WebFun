import { Zone } from "src/engine/objects";

import Engine from "../engine";
import { Tile, Hotspot } from "../objects";
import { NullIfMissing } from "src/engine/asset-manager";
import doorIn from "./hotspots/door-in";
import doorOut from "./hotspots/door-out";
import xWingFromDagobah from "./hotspots/x-wing-from-dagobah";
import xWingToDagobah from "./hotspots/x-wing-to-dagobah";
import teleporter from "./hotspots/teleporter";

class HotspotExecutor {
	private _engine: Engine;

	constructor(engine: Engine) {
		this._engine = engine;
	}

	laydownHotspotItems(zone: Zone): void {
		zone.hotspots.forEach(hotspot => this._laydownHotspotItem(zone, hotspot));
	}

	public trigger(hotspot: Hotspot) {
		switch (hotspot.type) {
			case Hotspot.Type.DoorIn:
				return doorIn(this._engine, hotspot);
			case Hotspot.Type.DoorOut:
				return doorOut(this._engine, hotspot);
			case Hotspot.Type.xWingFromDagobah:
				return xWingFromDagobah(this._engine, hotspot);
			case Hotspot.Type.xWingToDagobah:
				return xWingToDagobah(this._engine, hotspot);
			case Hotspot.Type.Teleporter:
				return teleporter(this._engine, hotspot);
		}
	}

	private _laydownHotspotItem(zone: Zone, hotspot: Hotspot): void {
		if (!hotspot.enabled) return;
		if (hotspot.arg === -1) return;

		const location = hotspot.location.clone();
		location.z = Zone.Layer.Object;

		const currentTile = zone.getTile(location);
		if (currentTile) return;

		const tile = this._engine.assetManager.get(Tile, hotspot.arg, NullIfMissing);

		const type = hotspot.type;
		if (type === Hotspot.Type.SpawnLocation) {
			// TODO: grab puzzle NPC from world
			// if (hotspot.arg !== zone.puzzleNPC) console.warn("NPC ID mismatch");
			zone.setTile(tile, location);
		} else if (
			hotspot.type === Hotspot.Type.TriggerLocation ||
			hotspot.type === Hotspot.Type.CrateItem ||
			hotspot.type === Hotspot.Type.CrateWeapon ||
			hotspot.type === Hotspot.Type.WeaponLocation
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
