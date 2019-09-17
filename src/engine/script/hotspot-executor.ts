import { NullIfMissing } from "src/engine/asset-manager";
import { Point } from "src/util";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Zone, Tile, Hotspot } from "src/engine/objects";
import Engine from "src/engine/engine";

import doorIn from "./hotspots/door-in";
import doorOut from "./hotspots/door-out";
import xWingFromDagobah from "./hotspots/x-wing-from-dagobah";
import xWingToDagobah from "./hotspots/x-wing-to-dagobah";
import teleporter from "./hotspots/teleporter";

class HotspotExecutor {
	private _engine: Engine;
	private travelZoneTypes = new WeakSet([Zone.Type.Town, Zone.Type.TravelStart, Zone.Type.TravelEnd]);
	private transportTypes = new WeakSet([Hotspot.Type.VehicleTo, Hotspot.Type.VehicleBack]);
	private dagobahTypes = new WeakSet([Hotspot.Type.xWingToDagobah, Hotspot.Type.xWingFromDagobah]);

	constructor(engine: Engine) {
		this._engine = engine;
	}

	public laydownHotspotItems(zone: Zone): void {
		zone.hotspots.forEach(hotspot => this._laydownHotspotItem(zone, hotspot));
	}

	public evaluateBumpHotspots(at: Point, zone: Zone, engine: Engine) {
		for (const hotspot of zone.hotspots) {
			if (!hotspot.location.isEqualTo(at)) continue;
			if (!hotspot.enabled) continue;
			if (
				![
					Hotspot.Type.TriggerLocation,
					Hotspot.Type.WeaponLocation,
					Hotspot.Type.LocatorLocation,
					Hotspot.Type.Unused,
					Hotspot.Type.CrateItem,
					Hotspot.Type.CrateWeapon
				].contains(hotspot.type)
			) {
				continue;
			}

			const itemID = hotspot.arg;
			if (itemID === -1) return;
			const currentTile = zone.getTileID(at.x, at.y, Zone.Layer.Object);
			if (currentTile !== itemID) return;

			zone.setTile(null, at.x, at.y, Zone.Layer.Object);
			engine.dropItem(engine.assetManager.get(Tile, itemID), at).then(() => {
				const sector = engine.currentWorld.findSectorContainingZone(zone);
				if (sector && sector.findItem && sector.findItem.id === itemID) {
					zone.solved = true;
					sector.zone.solved = true;
				}

				hotspot.enabled = false;
			});
		}
	}

	public uncoverSolvedHotspotItems(zone: Zone, engine: Engine) {
		for (const htsp of zone.hotspots) {
			if (!htsp.enabled) continue;
			if (htsp.type !== Hotspot.Type.CrateItem && htsp.type !== Hotspot.Type.TriggerLocation) continue;
			if (zone.getTile(htsp.x, htsp.y, Zone.Layer.Object)) continue;

			if (htsp.arg < 0) {
				htsp.enabled = false;
				continue;
			}

			const item = engine.assetManager.get(Tile, htsp.arg, NullIfMissing);
			const { sector } = engine.findSectorContainingZone(zone);
			if (item && sector && sector.findItem === item) {
				zone.solved = true;
				sector.zone.solved = true;
			}
			htsp.enabled = false;
			engine.dropItem(item, htsp.location);
		}
	}

	public evaluateZoneChangeHotspots(point: Point, zone: Zone, engine: Engine): boolean {
		if (!this.travelZoneTypes.has(zone.type)) {
			return false;
		}

		for (const hotspot of zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!hotspot.location.isEqualTo(point)) continue;
			if (this.transportTypes.has(hotspot.type)) {
				this._useTransport(hotspot, engine);
				return true;
			}
			if (this.dagobahTypes.has(hotspot.type)) {
				this._useXWing(hotspot, engine);
				return true;
			}
		}

		return false;
	}

	private _useTransport(htsp: Hotspot, engine: Engine) {
		const counterPart =
			htsp.type === Hotspot.Type.VehicleTo ? Hotspot.Type.VehicleBack : Hotspot.Type.VehicleTo;
		const destinationZone = engine.assetManager.get(Zone, htsp.arg);
		const worldLocation = engine.currentWorld.findLocationOfZone(destinationZone);
		const zoneLocation = destinationZone.hotspots.withType(counterPart).first().location;

		const transitionScene = new RoomTransitionScene();
		transitionScene.destinationHeroLocation = zoneLocation;
		transitionScene.destinationZone = destinationZone;
		transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;
		transitionScene.destinationWorld = engine.currentWorld;
		transitionScene.destinationZoneLocation = worldLocation;
		engine.sceneManager.pushScene(transitionScene);
		engine.temporaryState.enteredByPlane = true;

		engine.currentZone.solved = true;
		destinationZone.solved = true;

		return true;
	}

	private _useXWing(hotspot: Hotspot, engine: Engine) {
		switch (hotspot.type) {
			case Hotspot.Type.xWingFromDagobah: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const destinationZone = engine.assetManager.get(Zone, hotspot.arg);

				const transitionScene = new RoomTransitionScene();
				const otherHotspot = destinationZone.hotspots.withType(Hotspot.Type.xWingToDagobah).first();
				transitionScene.destinationHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				transitionScene.destinationZone = destinationZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

				const world = engine.world;
				const location = world.findLocationOfZone(destinationZone);
				console.assert(!!location, "Zone must be zone on the main planet");
				transitionScene.destinationWorld = world;
				transitionScene.destinationZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				engine.temporaryState.enteredByPlane = true;
				return true;
			}
			case Hotspot.Type.xWingToDagobah: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const destinationZone = engine.assetManager.get(Zone, hotspot.arg);

				const transitionScene = new RoomTransitionScene();
				const otherHotspot = destinationZone.hotspots.withType(Hotspot.Type.xWingFromDagobah).first();
				transitionScene.destinationHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				transitionScene.destinationZone = destinationZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

				const location = engine.dagobah.findLocationOfZone(destinationZone);
				console.assert(!!location, "Zone must be zone on dagobah");
				transitionScene.destinationWorld = engine.dagobah;
				transitionScene.destinationZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				engine.temporaryState.enteredByPlane = true;
				return true;
			}
		}
	}

	public triggerBumpHotspots(zone: Zone, engine: Engine) {
		if (engine.temporaryState.justEntered) return;
		const hero = engine.hero;

		const hotspotIsTriggered = (h: Hotspot) =>
			h.enabled && h.x === hero.location.x && h.y === hero.location.y;
		zone.hotspots.filter(hotspotIsTriggered).forEach((h: Hotspot) => this.trigger(h));
	}

	public triggerPlaceHotspots(tile: Tile, location: Point, zone: Zone, engine: Engine) {
		let acceptItem = false;
		const { sector } = engine.findSectorContainingZone(zone);
		console.assert(!!sector, "Could not find sector for zone", zone);

		let hotspot: Hotspot;
		for (hotspot of zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!hotspot.location.isEqualTo(location)) continue;
			if (
				![Hotspot.Type.PuzzleNPC, Hotspot.Type.Lock, Hotspot.Type.SpawnLocation].includes(
					hotspot.type
				)
			)
				continue;

			if (hotspot.type === Hotspot.Type.Lock) {
				const keyTileId = hotspot.arg < 0 ? sector.requiredItem.id : hotspot.arg;
				const keyTile = engine.assetManager.get(Tile, keyTileId);

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
			engine.inventory.removeItem(tile);
			hotspot.enabled = false;

			if (hotspot.type === Hotspot.Type.Lock || hotspot.type === Hotspot.Type.SpawnLocation) {
				zone.solved = true;
				sector.zone.solved = true;
			}

			if (hotspot.type === Hotspot.Type.SpawnLocation) {
				// TODO: speak
				engine.dropItem(sector.findItem, location);
			}
		}
	}

	public trigger(hotspot: Hotspot): boolean {
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

	pickUpHotspotItems(zone: Zone) {
		zone.hotspots.forEach(hotspot => this._pickUpHotspotItem(zone, hotspot));
	}

	private _pickUpHotspotItem(_zone: Zone, _hotspot: Hotspot) {}
}

export default HotspotExecutor;
