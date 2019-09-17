import { NullIfMissing } from "src/engine/asset-manager";
import { Point } from "src/util";
import { Zone, Tile, Hotspot } from "src/engine/objects";
import Engine from "src/engine/engine";

import doorIn from "./hotspots/door-in";
import doorOut from "./hotspots/door-out";
import xWingFromDagobah from "./hotspots/x-wing-from-dagobah";
import xWingToDagobah from "./hotspots/x-wing-to-dagobah";
import teleporter from "./hotspots/teleporter";

class HotspotExecutor {
	private _engine: Engine;
	private travelZoneTypes = new WeakSet([
		Zone.Type.Town,
		Zone.Type.TravelStart,
		Zone.Type.TravelEnd,
		Zone.Type.Empty
	]);
	private travelTypes = new WeakSet([
		Hotspot.Type.VehicleTo,
		Hotspot.Type.VehicleBack,
		Hotspot.Type.xWingToDagobah,
		Hotspot.Type.xWingFromDagobah,
		Hotspot.Type.Teleporter
	]);
	private bumpTypes = new WeakSet([
		Hotspot.Type.TriggerLocation,
		Hotspot.Type.WeaponLocation,
		Hotspot.Type.LocatorLocation,
		Hotspot.Type.Unused,
		Hotspot.Type.CrateItem,
		Hotspot.Type.CrateWeapon
	]);
	private placeTileTypes = new WeakSet([
		Hotspot.Type.PuzzleNPC,
		Hotspot.Type.Lock,
		Hotspot.Type.SpawnLocation
	]);

	constructor(engine: Engine) {
		this._engine = engine;
	}

	public laydownHotspotItems(zone: Zone): void {
		zone.hotspots.forEach(hotspot => this._laydownHotspotItem(zone, hotspot));
	}

	public evaluateBumpHotspots(at: Point, zone: Zone) {
		for (const hotspot of zone.hotspots) {
			if (!hotspot.location.isEqualTo(at)) continue;
			if (!hotspot.enabled) continue;
			if (!this.bumpTypes.has(hotspot.type)) continue;

			const itemID = hotspot.arg;
			if (itemID === -1) return;
			const currentTile = zone.getTileID(at.x, at.y, Zone.Layer.Object);
			if (currentTile !== itemID) return;

			zone.setTile(null, at.x, at.y, Zone.Layer.Object);
			this._engine.dropItem(this._engine.assetManager.get(Tile, itemID), at).then(() => {
				const sector = this._engine.currentWorld.findSectorContainingZone(zone);
				if (sector && sector.findItem && sector.findItem.id === itemID) {
					zone.solved = true;
					sector.zone.solved = true;
				}

				hotspot.enabled = false;
			});
		}
	}

	public uncoverSolvedHotspotItems(zone: Zone) {
		for (const htsp of zone.hotspots) {
			if (!htsp.enabled) continue;
			if (htsp.type !== Hotspot.Type.CrateItem && htsp.type !== Hotspot.Type.TriggerLocation) continue;
			if (zone.getTile(htsp.x, htsp.y, Zone.Layer.Object)) continue;

			if (htsp.arg < 0) {
				htsp.enabled = false;
				continue;
			}

			const item = this._engine.assetManager.get(Tile, htsp.arg, NullIfMissing);
			const { sector } = this._engine.findSectorContainingZone(zone);
			if (item && sector && sector.findItem === item) {
				zone.solved = true;
				sector.zone.solved = true;
			}
			htsp.enabled = false;
			this._engine.dropItem(item, htsp.location);
		}
	}

	public evaluateZoneChangeHotspots(point: Point, zone: Zone): boolean {
		if (!this.travelZoneTypes.has(zone.type)) {
			return false;
		}

		for (const hotspot of zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!hotspot.location.isEqualTo(point)) continue;
			if (!this.travelTypes.has(hotspot.type)) continue;

			return this.trigger(hotspot);
		}

		return false;
	}

	public triggerBumpHotspots(zone: Zone): void {
		if (this._engine.temporaryState.justEntered) return;
		const hero = this._engine.hero;

		const hotspotIsTriggered = (h: Hotspot) =>
			h.enabled && h.x === hero.location.x && h.y === hero.location.y;
		zone.hotspots.filter(hotspotIsTriggered).forEach((h: Hotspot) => this.trigger(h));
	}

	public triggerPlaceHotspots(tile: Tile, location: Point, zone: Zone) {
		let acceptItem = false;
		const { sector } = this._engine.findSectorContainingZone(zone);
		console.assert(!!sector, "Could not find sector for zone", zone);

		let hotspot: Hotspot;
		for (hotspot of zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!hotspot.location.isEqualTo(location)) continue;
			if (!this.placeTileTypes.has(hotspot.type)) continue;

			if (hotspot.type === Hotspot.Type.Lock) {
				const keyTileId = hotspot.arg < 0 ? sector.requiredItem.id : hotspot.arg;
				const keyTile = this._engine.assetManager.get(Tile, keyTileId);

				acceptItem = tile === keyTile;
				break;
			}

			if (tile !== sector.requiredItem) {
				// TODO: Play sound no-go
				break;
			}

			acceptItem = true;
			break;
		}

		if (acceptItem) {
			this._engine.inventory.removeItem(tile);
			hotspot.enabled = false;

			if (hotspot.type === Hotspot.Type.Lock || hotspot.type === Hotspot.Type.SpawnLocation) {
				zone.solved = true;
				sector.zone.solved = true;
			}

			if (hotspot.type === Hotspot.Type.SpawnLocation) {
				// TODO: speak
				this._engine.dropItem(sector.findItem, location);
			}
		}
	}

	private trigger(hotspot: Hotspot): boolean {
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

		return false;
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
}

export default HotspotExecutor;
