import { HotspotExecutionMode } from "./hotspot-execution-mode";
import { HotspotExecutionResult } from "./hotspot-execution-result";
import { NullIfMissing } from "src/engine/asset-manager";
import { Point } from "src/util";
import { Zone, Tile, Hotspot, Puzzle, Sound } from "src/engine/objects";
import Engine from "src/engine/engine";

import drop from "./hotspots/drop";
import doorIn from "./hotspots/door-in";
import doorOut from "./hotspots/door-out";
import shipFromPlanet from "./hotspots/ship-from-planet";
import shipToPlanet from "./hotspots/ship-to-planet";
import spawnLocation from "./hotspots/spawn-location";
import teleporter from "./hotspots/teleporter";
import useTransport from "./hotspots/use-transport";
import { Channel } from "../audio";

type SimpleHotspot = (engine: Engine, hotspot: Hotspot) => HotspotExecutionResult;
type Dispatch = WeakMap<Hotspot.Type, SimpleHotspot>;

class HotspotProcessingUnit {
	private _engine: Engine;
	private initializeTypes = new WeakSet([
		Hotspot.Type.DropMap,
		Hotspot.Type.DropItem,
		Hotspot.Type.DropWeapon,
		Hotspot.Type.DropQuestItem,
		Hotspot.Type.DropUniqueWeapon,
		Hotspot.Type.NPC,
		Hotspot.Type.SpawnLocation
	]);
	private standDispatch = new WeakMap<Hotspot.Type, SimpleHotspot>([
		[Hotspot.Type.VehicleTo, useTransport],
		[Hotspot.Type.VehicleBack, useTransport],
		[Hotspot.Type.ShipToPlanet, shipToPlanet],
		[Hotspot.Type.ShipFromPlanet, shipFromPlanet]
	]);
	private walkDispatch = new WeakMap<Hotspot.Type, SimpleHotspot>([
		[Hotspot.Type.DoorIn, doorIn],
		[Hotspot.Type.DoorOut, doorOut],
		[Hotspot.Type.Teleporter, teleporter]
	]);
	private bumpDispatch = new WeakMap<Hotspot.Type, SimpleHotspot>([
		[Hotspot.Type.SpawnLocation, spawnLocation],
		[Hotspot.Type.DropItem, drop],
		[Hotspot.Type.DropMap, drop],
		[Hotspot.Type.DropQuestItem, drop],
		[Hotspot.Type.DropUniqueWeapon, drop],
		[Hotspot.Type.DropWeapon, drop]
	]);

	constructor(engine: Engine) {
		this._engine = engine;
	}

	public execute(mode: HotspotExecutionMode, point?: Point, tile?: Tile): HotspotExecutionResult {
		const zone = this._engine.currentZone;
		point = point || this._engine.hero.location;
		switch (mode) {
			case HotspotExecutionMode.Initialize:
				zone.hotspots.forEach(hotspot => this._laydownHotspotItem(zone, hotspot));
				break;
			case HotspotExecutionMode.Bump:
				return this.executeHotspots(point, this.bumpDispatch);
			case HotspotExecutionMode.PlaceTile:
				return this.executePlacedTileHotspots(point, tile);
			case HotspotExecutionMode.Stand:
				return this.executeHotspots(point, this.standDispatch);
			case HotspotExecutionMode.Walk:
				return this.executeHotspots(point, this.walkDispatch);
		}

		return HotspotExecutionResult.Void;
	}

	private executeHotspots(point: Point, dispatch: Dispatch): HotspotExecutionResult {
		const engine = this._engine;
		const zone = engine.currentZone;
		for (const hotspot of zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!dispatch.has(hotspot.type)) continue;
			if (!hotspot.location.isEqualTo(point)) continue;

			return dispatch.get(hotspot.type)(engine, hotspot);
		}

		return HotspotExecutionResult.Void;
	}

	private executePlacedTileHotspots(point: Point, tile: Tile): HotspotExecutionResult {
		const engine = this._engine;
		const story = engine.story;
		const zone = this._engine.currentZone;
		const { sector } = engine.findSectorContainingZone(zone);
		const puzzleIndex = sector.puzzleIndex;
		if (puzzleIndex < 0 || sector.solved1) {
			const hotspot = zone.hotspots.find(htsp => htsp.location.isEqualTo(point));
			if (!hotspot) return HotspotExecutionResult.Void;
			if (!hotspot.enabled) return HotspotExecutionResult.Void;
			if (hotspot.type !== Hotspot.Type.Lock) return HotspotExecutionResult.Void;
			if (sector.requiredItem !== tile) return HotspotExecutionResult.Void;

			sector.solved1 = true;
			engine.inventory.removeItem(tile);
			return HotspotExecutionResult.Void;
		}

		const puzzles = sector.usedAlternateStrain ? story.puzzles[0] : story.puzzles[1];
		const puzzle = puzzles[puzzleIndex];
		if (!puzzle) return HotspotExecutionResult.Void;

		if (puzzle.type === Puzzle.Type.Use) {
			if (sector.requiredItem !== tile) return HotspotExecutionResult.Void;

			const npc = zone.getTile(point.x, point.y, Zone.Layer.Object);
			const hotspot = zone.hotspots.find(htsp => htsp.location.isEqualTo(point));
			if (sector.npc === npc && hotspot && hotspot.enabled) {
				const findItem = sector.findItem;
				engine.inventory.removeItem(tile);
				const text = puzzle.strings[1];
				engine
					.speak(text, point)
					.then(() => engine.dropItem(findItem, point))
					.then(() => {
						sector.solved1 = true;
						sector.solved2 = true;
					});
				return (
					HotspotExecutionResult.Speak |
					HotspotExecutionResult.Drop |
					HotspotExecutionResult.Inventory
				);
			} else {
				const nogo = engine.assets.get(Sound, engine.variant.sounds.NoGo);
				engine.mixer.play(nogo, Channel.Effect);
				return HotspotExecutionResult.Sounds;
			}
		}

		if (puzzle.type === Puzzle.Type.Trade) {
			const hotspot = zone.hotspots.find(
				htsp =>
					htsp.location.isEqualTo(point) &&
					htsp.enabled &&
					htsp.type === Hotspot.Type.Lock &&
					htsp.arg === tile.id
			);
			if (!hotspot) {
				const nogo = engine.assets.get(Sound, engine.variant.sounds.NoGo);
				engine.mixer.play(nogo, Channel.Effect);
				return HotspotExecutionResult.Sounds;
			}
			sector.solved1 = true;
			engine.inventory.removeItem(tile);
			const findItem = sector.findItem;
			if (!findItem) {
				return HotspotExecutionResult.Inventory;
			}
			const unlockedHotspot = zone.hotspots.find(
				htsp => htsp.type === Hotspot.Type.DropQuestItem && htsp.enabled && htsp.arg === findItem.id
			);

			if (!unlockedHotspot) {
				return HotspotExecutionResult.Inventory;
			}
			sector.solved2 = true;
			engine.dropItem(findItem, point);

			return HotspotExecutionResult.Inventory | HotspotExecutionResult.Drop;
		}

		console.log("unhandled case for puzzle type", puzzle.type.name);
	}

	private _laydownHotspotItem(zone: Zone, hotspot: Hotspot): void {
		if (!hotspot.enabled) return;

		if (hotspot.arg === -1) return;
		if (!this.initializeTypes.has(hotspot.type)) return;

		const location = hotspot.location.clone();
		location.z = Zone.Layer.Object;

		const currentTile = zone.getTile(location);
		if (currentTile) return;

		const tile = this._engine.assets.get(Tile, hotspot.arg, NullIfMissing);
		zone.setTile(tile, location);
	}
}

export default HotspotProcessingUnit;
