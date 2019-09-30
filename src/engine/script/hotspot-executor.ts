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
import vehicleBack from "./hotspots/vehicle-back";
import vehicleTo from "./hotspots/vehicle-to";
import { Channel } from "../audio";

type SimpleHotspot = (engine: Engine, hotspot: Hotspot) => HotspotExecutionResult;
class HotspotExecutor {
	private _engine: Engine;
	private travelZoneTypes = new WeakSet([
		Zone.Type.Town,
		Zone.Type.TravelStart,
		Zone.Type.TravelEnd,
		Zone.Type.Empty
	]);
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
		[Hotspot.Type.VehicleTo, vehicleTo],
		[Hotspot.Type.VehicleBack, vehicleBack],
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
	private bumpTypes = new WeakSet([
		Hotspot.Type.DropQuestItem,
		Hotspot.Type.DropUniqueWeapon,
		Hotspot.Type.DropMap,
		Hotspot.Type.Unused,
		Hotspot.Type.DropItem,
		Hotspot.Type.DropWeapon
	]);
	private placeTileTypes = new WeakSet([Hotspot.Type.NPC, Hotspot.Type.Lock, Hotspot.Type.SpawnLocation]);

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

	private executeHotspots(
		point: Point,
		dispatch: WeakMap<Hotspot.Type, SimpleHotspot>
	): HotspotExecutionResult {
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
			console.log("found use puzzle");
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
				const nogo = engine.assets.get(Sound, engine.type.sounds.NoGo);
				engine.mixer.play(nogo, Channel.Effect);
				return HotspotExecutionResult.Sounds;
			}
		}

		if (puzzle.type === Puzzle.Type.Trade) {
			console.log("found trade puzzle");
			const hotspot = zone.hotspots.find(
				htsp =>
					htsp.location.isEqualTo(point) &&
					htsp.enabled &&
					htsp.type === Hotspot.Type.Lock &&
					htsp.arg === tile.id
			);
			if (!hotspot) {
				console.log("no htsp");
				const nogo = engine.assets.get(Sound, engine.type.sounds.NoGo);
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
		/*
      view_1 = view;
      view_2 = view;
      document_8 = view->document;
      game_mode = document_8->game_mode_1;
      document_8->game_mode_1 = 1;
      evaluation_result = Zone::EvaluateActions(
                            view_1->document->current_zone,
                            PlaceItem,
                            x,
                            y,
                            0,
                            0,
                            0,
                            context_1,
                            view_1->document,
                            view_2);
      zone_type = view->document->current_zone->type;
      if ( zone_type == TravelStart || zone_type == TravelEnd || zone_type == Town )
        YodaView::EvaluateZoneChangeHotspots(view);
      document_9 = view->document;
      if ( game_mode == GAME_MODE_1_INVENTORY_CLICK )
      {
        game_mode_1 = document_9->game_mode_1;
        game_mode_1_ref = &document_9->game_mode_1;
        if ( game_mode_1 != GAME_MODE_1_PICKUP && game_mode_1 != GAME_MODE_1_CHANGING_ZONES )
          *game_mode_1_ref = GAME_MODE_1_WALK;
      }
      else
      {
        game_mode_2 = document_9->game_mode_1;
        game_mode_3 = &document_9->game_mode_1;
        if ( game_mode_2 != GAME_MODE_1_CHANGING_ZONES && game_mode_2 != GAME_MODE_1_PICKUP )
          *game_mode_3 = game_mode;
      }
      if ( !(evaluation_result & UpdateSounds) )
        YodaView::PlaySound(view, (SOUND_NAME)document_10);
      goto update_palette_and_return;
*/
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

export default HotspotExecutor;
