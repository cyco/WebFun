import { Direction, Point, Size } from "src/util";
import { EvaluationMode, ScriptResult } from "../script";
import {
	Hotspot,
	HotspotType,
	NPC,
	Zone,
	ZoneType,
	Tile,
	CharFrameEntry,
	Char,
	Puzzle
} from "src/engine/objects";
import { Direction as InputDirection } from "src/engine/input";
import { Sprite } from "../rendering";
import { WorldItem } from "src/engine/generation";
import { Yoda } from "src/engine";
import AbstractRenderer from "src/engine/rendering/abstract-renderer";
import DetonatorScene from "./detonator-scene";
import Engine from "src/engine/engine";
import Hero from "src/engine/hero";
import MapScene from "./map-scene";
import PauseScene from "./pause-scene";
import PickupScene from "./pickup-scene";
import Scene from "./scene";
import SpeechScene from "./speech-scene";
import TeleporterScene from "./teleport-scene";
import TransitionScene from "./transition-scene";
import ZoneSceneRenderer from "src/engine/rendering/zone-scene-renderer";

class ZoneScene extends Scene {
	private _zone: Zone;
	private _renderer = new ZoneSceneRenderer();

	public async update(ticks: number) {
		this.engine.palette.step();

		const engine = this.engine;
		const hero = engine.hero;
		hero.isWalking = false;

		let scriptResult = await engine.scriptExecutor.execute();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		scriptResult = await this._handlePlacedTile();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		engine.scriptExecutor.prepeareExecution(EvaluationMode.Walk, this.zone);
		scriptResult = await engine.scriptExecutor.execute();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		if (this._evaluateZoneChangeHotspots()) return;

		scriptResult = await this._moveBullets();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}
		this._moveNPCs();

		// await this._handleMouse();
		const stop = await this._handleKeys();
		if (stop) return;

		this.engine.camera.update(ticks);
		hero.update(ticks);
		scriptResult = await engine.scriptExecutor.execute();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		engine.scriptExecutor.prepeareExecution(EvaluationMode.Walk, this.zone);
		scriptResult = await engine.scriptExecutor.execute();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		this._evaluateZoneChangeHotspots();
	}

	public render(renderer: AbstractRenderer) {
		const bulletTiles: Sprite[] = [];
		const hero = this.engine.hero;
		if (hero.isAttacking && hero.weapon) {
			let tile = this._extensionTileForBullet();
			if (tile) {
				const rel = Direction.CalculateRelativeCoordinates(hero.direction, 1);
				const position = hero.location.byAdding(rel);
				const sprite = new Sprite(position, new Size(Tile.WIDTH, Tile.HEIGHT), tile.imageData);
				bulletTiles.push(sprite);
			}

			tile = this._bulletTileForBullet();
			if (tile) {
				const rel = Direction.CalculateRelativeCoordinates(hero.direction, hero._actionFrames + 1);
				const position = hero.location.byAdding(rel);
				const object = this.zone.getTile(position);
				if (!object || object.isOpaque()) {
					const sprite = new Sprite(position, new Size(Tile.WIDTH, Tile.HEIGHT), tile.imageData);
					bulletTiles.push(sprite);
				}
			}
		}

		this._renderer.render(this._zone, this.engine, renderer, this.engine.palette.current, bulletTiles);
	}

	private _extensionTileForBullet(): Tile {
		const hero = this.engine.hero;
		const frames = hero.weapon.frames;
		const direction = hero.direction;
		const frameEntry = this._extensionFrameLocationForDirection(direction);
		let animState: number;
		if (hero._actionFrames === 0) {
			animState = 1;
		} else if (hero._actionFrames === 1) {
			animState = 2;
		} else if (hero._actionFrames === 2) {
			animState = 1;
		} else if (hero._actionFrames === 3) {
			return null;
		} else {
			return null;
		}

		return frames[animState].tiles[frameEntry];
	}

	private _bulletTileForBullet(): Tile {
		const hero = this.engine.hero;
		if (hero._actionFrames === 3) {
			return null;
		}

		const frames = hero.weapon.frames;
		const direction = hero.direction;
		const frameEntry = this._frameLocationForDirection(direction);
		return frames[0].tiles[frameEntry];
	}

	private _extensionFrameLocationForDirection(direction: number) {
		switch (Direction.Confine(direction)) {
			case Direction.South:
				return CharFrameEntry.ExtensionDown;
			case Direction.North:
				return CharFrameEntry.ExtensionUp;
			case Direction.East:
				return CharFrameEntry.ExtensionRight;
			case Direction.West:
				return CharFrameEntry.ExtensionLeft;
		}
	}

	private _frameLocationForDirection(direction: number) {
		switch (Direction.Confine(direction)) {
			case Direction.South:
				return CharFrameEntry.Down;
			case Direction.North:
				return CharFrameEntry.Up;
			case Direction.East:
				return CharFrameEntry.Right;
			case Direction.West:
				return CharFrameEntry.Left;
		}
	}

	public executeHotspots() {
		if (this.engine.temporaryState.justEntered) return;
		const zone = this.zone;
		const hero = this.engine.hero;

		const hotspotIsTriggered = (h: Hotspot) =>
			h.enabled && h.x === hero.location.x && h.y === hero.location.y;
		zone.hotspots.filter(hotspotIsTriggered).forEach((h: Hotspot) => this._hotspotTriggered(h));
	}

	private _hotspotTriggered(hotspot: Hotspot) {
		const engine = this.engine;
		const zone = engine.currentZone;

		switch (hotspot.type) {
			case HotspotType.DoorIn: {
				const targetZone = engine.data.zones[hotspot.arg];
				const waysOut = targetZone.hotspots.filter((h: Hotspot) => h.type === HotspotType.DoorOut);

				if (waysOut.length !== 1) console.warn("Found multiple doors out");

				const scene = new TransitionScene();
				scene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				scene.targetHeroLocation = new Point(waysOut.first().x, waysOut.first().y);
				scene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				scene.scene = engine.sceneManager.currentScene as ZoneScene;

				let world = engine.dagobah;
				let location = world.locationOfZone(targetZone);
				if (!location) {
					world = engine.world;
					location = world.locationOfZone(targetZone);
				}
				scene.targetWorld = world;

				targetZone.hotspots
					.filter((hotspot: Hotspot) => {
						return hotspot.type === HotspotType.DoorOut && hotspot.arg === -1;
					})
					.forEach((hotspot: Hotspot) => (hotspot.arg = zone.id));

				if (!location) {
					world = null;
					location = null;
				}
				scene.targetZoneLocation = location;
				engine.sceneManager.pushScene(scene);
				return true;
			}
			case HotspotType.DoorOut: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				zone.hotspots
					.filter(hotspot => {
						return hotspot.type === HotspotType.DoorOut;
					})
					.forEach(hotspot => (hotspot.arg = -1));

				const waysIn = targetZone.hotspots.filter(
					(hotspot: Hotspot) =>
						hotspot.type === HotspotType.DoorIn && hotspot.arg === zone.id && hotspot.enabled
				);
				if (waysIn.length !== 1) console.warn("Found multiple doors we might have come through!");
				if (waysIn.length === 0) console.warn("Found no active door to return to zone");

				const scene = new TransitionScene();
				scene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				scene.targetHeroLocation = new Point(waysIn.first().x, waysIn.first().y);
				scene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				scene.scene = engine.sceneManager.currentScene as ZoneScene;

				let world = engine.dagobah;
				let location = world.locationOfZone(targetZone);
				if (!location) {
					world = engine.world;
					location = world.locationOfZone(targetZone);
				}
				scene.targetWorld = world;

				if (!location) {
					world = null;
					location = null;
				}
				scene.targetZoneLocation = location;
				engine.sceneManager.pushScene(scene);
				return true;
			}
			case HotspotType.xWingFromD: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				const scene = new TransitionScene();
				scene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				const otherHotspot = targetZone.hotspots.withType(HotspotType.xWingToD).first();
				scene.targetHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				scene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				scene.scene = engine.sceneManager.currentScene as ZoneScene;

				const world = engine.world;
				const location = world.locationOfZone(targetZone);
				if (!location) {
					// zone is not on the current planet
					return;
				}
				scene.targetWorld = world;
				scene.targetZoneLocation = location;
				engine.sceneManager.pushScene(scene);
				this.engine.temporaryState.enteredByPlane = true;
				return true;
			}
			case HotspotType.xWingToD: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				const scene = new TransitionScene();
				scene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				const otherHotspot = targetZone.hotspots.withType(HotspotType.xWingFromD).first();
				scene.targetHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				scene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				scene.scene = engine.sceneManager.currentScene as ZoneScene;

				const location = engine.dagobah.locationOfZone(targetZone);
				if (!location) {
					// zone is not on dagobah
					return;
				}
				scene.targetWorld = engine.dagobah;
				scene.targetZoneLocation = location;
				engine.sceneManager.pushScene(scene);
				this.engine.temporaryState.enteredByPlane = true;
				return true;
			}
			case HotspotType.Teleporter: {
				if (!engine.inventory.contains(Yoda.ItemIDs.Locator)) return;

				const scene = new TeleporterScene();
				engine.sceneManager.pushScene(scene);
				return true;
			}
		}
	}

	private _tryTransition(direction: Point): boolean | undefined {
		const engine = this.engine;
		const state = engine.temporaryState;
		const hero = engine.hero;
		const currentZone = engine.currentZone;

		const targetLocation = Point.add(hero.location, direction);
		if (currentZone.bounds.contains(targetLocation)) {
			// console.log('target is on same zone!');
			return false;
		}

		const zoneDirection = new Point(targetLocation.x, targetLocation.y);
		if (zoneDirection.x < 0) zoneDirection.x = -1;
		else if (zoneDirection.x >= 18) zoneDirection.x = 1;
		else zoneDirection.x = 0;

		if (zoneDirection.y < 0) zoneDirection.y = -1;
		else if (zoneDirection.y >= 18) zoneDirection.y = 1;
		else zoneDirection.y = 0;

		if (!zoneDirection.isUnidirectional()) {
			console.log("can't move two zones at once!");
			return false;
		}

		const zoneLocation = state.worldLocation;
		let world = engine.dagobah;
		if (world.locationOfZone(engine.currentZone) === null) {
			world = engine.world;
		}

		if (!zoneLocation) return;

		const targetZoneLocation = Point.add(zoneLocation, zoneDirection);
		const targetZone = world.getZone(targetZoneLocation);
		if (!targetZone) return false;

		const targetLocationOnCurrentZone = Point.add(hero.location, direction);
		if (currentZone.bounds.contains(targetLocationOnCurrentZone)) return false;

		const targetHeroLocation = Point.add(hero.location, direction);
		targetHeroLocation.subtract(zoneDirection.x * 18, zoneDirection.y * 18);

		if (!targetZone.placeWalkable(targetHeroLocation)) {
			console.log("Tile is blocked on target zone!");
			return false;
		}

		const transitionScene = new TransitionScene();
		transitionScene.type = TransitionScene.TRANSITION_TYPE.ZONE;
		transitionScene.targetHeroLocation = targetHeroLocation;
		transitionScene.targetZoneLocation = targetZoneLocation;
		transitionScene.sourceZoneLocation = zoneLocation;
		transitionScene.targetZone = targetZone;
		transitionScene.targetWorld = world;
		transitionScene.scene = this;
		engine.sceneManager.pushScene(transitionScene);

		return true;
	}

	private async _moveBullets(): Promise<ScriptResult> {
		const hero = this.engine.hero;
		if (!hero.isAttacking) return ScriptResult.Done;
		const frames = hero._actionFrames;

		if (frames === 3) {
			hero.isAttacking = false;
			hero._actionFrames = 0;
			return ScriptResult.Done;
		}

		const target = hero.location.byAdding(
			Direction.CalculateRelativeCoordinates(hero.direction, frames + 1)
		);

		const hitNPCs = this.zone.npcs.filter(
			({ position, alive, enabled }) => alive && enabled && position.isEqualTo(target)
		);

		hitNPCs.forEach(npc => this.hitNPC(npc, hero.weapon));
		if (hitNPCs.length) {
			hero.isAttacking = false;
			hero._actionFrames = 0;
			return ScriptResult.Done;
		}

		const tile = this.zone.getTile(target);
		if (!this._bulletTileForBullet()) return ScriptResult.Done;

		if (!tile || tile.isOpaque()) {
			// evaluate scripts
			this.engine.inputManager.placedTileLocation = target;
			this.engine.inputManager.placedTile = hero.weapon.frames[0].tiles[CharFrameEntry.ExtensionRight];
			this.engine.scriptExecutor.prepeareExecution(EvaluationMode.PlaceItem, this.zone);
			return await this.engine.scriptExecutor.execute();
		}

		hero.isAttacking = false;
		hero._actionFrames = 0;
		// TODO: damage npc
	}

	private hitNPC(npc: NPC, weapon: Char) {
		npc.damageTaken += weapon.damage;
		if (!npc.alive) {
			this.zone.setTile(null, npc.position);
			npc.enabled = false;
		}
	}

	private _moveNPCs() {
		this._zone.npcs.forEach(npc => this._moveNPC(npc));
	}

	private _moveNPC(npc: NPC) {
		if (!npc.enabled) return;
		console.assert(npc.position.z === Zone.Layer.Object, "NPCs must be placed on object layer!");

		const vector = new Point(0, 0);
		switch (npc.face.movementType) {
			default:
				vector.y = 1;
		}

		const target = npc.position.byAdding(vector);
		if (!this.zone.bounds.contains(target)) {
			return;
		}

		const targetTile = this.zone.getTile(target);
		if (targetTile) {
			return;
		}

		this.zone.setTile(null, npc.position);
		npc.position = target;
		this.zone.setTile(npc.face.frames[0].down, npc.position);
	}

	prepareCamera() {
		this.engine.camera.update(Infinity);
	}

	willShow() {
		this.camera.hero = this.engine.hero;
	}

	willHide() {}

	private async _handleMouse(): Promise<void> {
		const engine = this.engine;

		const inputManager = engine.inputManager;
		const mouseLocationInView = inputManager.mouseLocationInView;

		const camera = this.engine.camera;
		const offset = camera.offset;
		const size = camera.size;
		const hero = engine.hero;

		const mouseLocationOnZone = new Point(
			mouseLocationInView.x * size.width - offset.x - 0.5,
			mouseLocationInView.y * size.height - offset.y - 0.5
		);

		const relativeLocation = Point.subtract(mouseLocationOnZone, hero.location);

		const onHero = Math.abs(relativeLocation.x) < 0.5 && Math.abs(relativeLocation.y) < 0.5;
		const closeToViewEdge =
			mouseLocationInView.x < 1 / 18 ||
			mouseLocationInView.y < 1 / 18 ||
			mouseLocationInView.x > 17 / 18 ||
			mouseLocationInView.y > 17 / 18;
		if (!onHero || closeToViewEdge) {
			const direction = Direction.CalculateAngleFromRelativePoint(relativeLocation);

			if (isNaN(direction)) return;

			hero.face(direction);
			if (inputManager.walk) await this._moveHero(direction);
		}
	}

	private async _handleKeys(): Promise<boolean> {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		const hero = engine.hero;

		if (inputManager.pause) {
			const pauseScene = new PauseScene();
			this.engine.sceneManager.pushScene(pauseScene);
			return true;
		}

		if (inputManager.locator) {
			// && hero.hasLocator();
			const mapScene = new MapScene();
			this.engine.sceneManager.pushScene(mapScene);
			return true;
		}

		if (hero.isAttacking) return false;

		hero.isDragging = inputManager.drag;
		hero.isAttacking = inputManager.attack;
		if (hero.isAttacking) this._attackTriggered();
		if (hero.isAttacking) {
			hero._actionFrames = 0;
			hero.isWalking = false;
			hero.isDragging = false;
			this._placeBullet(hero);
			return true;
		}

		if (inputManager.walk) {
			const point = new Point(0, 0);
			const directions = inputManager.directions;
			if (directions & InputDirection.Up) {
				point.y -= 1;
			}
			if (directions & InputDirection.Down) {
				point.y += 1;
			}
			if (directions & InputDirection.Left) {
				point.x -= 1;
			}
			if (directions & InputDirection.Right) {
				point.x += 1;
			}

			const direction = Direction.CalculateAngleFromRelativePoint(point);
			if (isNaN(direction)) return;

			hero.face(direction);
			if (inputManager.walk) await this._moveHero(direction);
		}

		return false;
	}

	private _attackTriggered() {
		const hero = this.engine.hero;
		const weapon = hero.weapon;
		const zone = this.engine.currentZone;

		// do nothing if no weapon is equipped
		if (!weapon) {
			hero.isAttacking = false;
			return;
		}

		// do nothing if hero is looking away from the zone
		const point = Direction.CalculateRelativeCoordinates(hero.direction, 1);
		const inertia = new Point(point.x, point.y, 0);
		if (!Point.add(hero.location, inertia).isInBounds(zone.size)) {
			hero.isAttacking = false;
			return;
		}
	}

	private async _moveHero(direction: number): Promise<void> {
		const engine = this.engine;
		const hero = engine.hero;
		const zone = engine.currentZone;

		const diri = Direction.Confine(direction);
		const point = Direction.CalculateRelativeCoordinates(diri, 1);
		const p = new Point(point.x, point.y, 0);

		hero.isWalking = true;

		const targetPoint = Point.add(hero.location, p);
		const targetTile = zone.bounds.contains(targetPoint) && zone.getTile(targetPoint.x, targetPoint.y, 1);

		if (targetTile) {
			// TODO: get rid of temporary state
			engine.temporaryState.bump = targetPoint;
			this.evaluateBumpHotspots(targetPoint, engine);

			engine.scriptExecutor.prepeareExecution(EvaluationMode.Bump, this.zone);

			const worldItem = this.engine.currentWorld.at(this.engine.currentWorld.locationOfZone(this.zone));
			if (worldItem.npc && worldItem.npc.id === targetTile.id) {
				console.log("this._bumpPuzzleNPC");
				this._bumpPuzzleNPC(worldItem, targetPoint);
				return;
			}

			const scriptResult = await engine.scriptExecutor.execute();
			if (scriptResult !== ScriptResult.Done) {
				return;
			}
		}

		if (!hero.move(p, this.zone)) {
			const doTransition = this._tryTransition(p);
			if (doTransition === false) {
				// TODO: play blocked sound
			}
		} else this.executeHotspots();
	}

	private _placeBullet(hero: Hero) {
		hero.ammo--;
		if (hero.ammo === 0) this.reloadWeapon();
	}

	private _bumpPuzzleNPC(worldItem: WorldItem, place: Point) {
		const puzzleIndex = worldItem.puzzleIndex;
		let puzzle: Puzzle = null;

		if (puzzleIndex === -1) {
			puzzle = this.engine.story.goal;
			let text = "";
			let item: Tile = null;
			if (worldItem.zone.solved) {
				text = puzzle.strings[2];
			} else {
				text = puzzle.strings[3];
				item = worldItem.findItem;
			}

			if (text.length) {
				this.engine
					.speak(text, place)
					.then(async () => !item || (await this.engine.dropItem(item, place)))
					.then(() => (this.zone.solved = true));
			}

			return;
		} else {
			console.log("puzzle at index", this.engine.data.puzzles[puzzleIndex]);
		}
	}

	private reloadWeapon() {
		const engine = this.engine;
		const inventory = engine.inventory;
		const hero = engine.hero;
		const weapon = hero.weapon;

		const weaponTile = weapon.frames[0].extensionRight;
		inventory.removeItem(weaponTile);
		if (inventory.contains(weaponTile)) {
			hero.ammo = 1;
			engine.equip(weaponTile);
		} else engine.equip(inventory.find(tile => tile.isWeapon()));
	}

	private evaluateBumpHotspots(at: Point, engine: Engine) {
		for (const hotspot of this.zone.hotspots) {
			if (!hotspot.location.isEqualTo(at)) continue;
			if (!hotspot.enabled) continue;
			if (
				![
					HotspotType.TriggerLocation,
					HotspotType.ForceLocation,
					HotspotType.LocatorThingy,
					HotspotType.Unused,
					HotspotType.CrateItem,
					HotspotType.CrateWeapon
				].contains(hotspot.type)
			) {
				continue;
			}

			const itemID = hotspot.arg;
			if (itemID === -1) return;
			const currentTile = this.zone.getTileID(at.x, at.y, 1);
			if (currentTile !== itemID) return;

			this.zone.setTile(null, at.x, at.y, 1);
			const pickupScene = new PickupScene(engine);
			pickupScene.location = at;
			pickupScene.tile = engine.data.tiles[itemID];

			const worldItem = this.engine.currentWorld.at(this.engine.currentWorld.locationOfZone(this.zone));
			if (worldItem && worldItem.findItem && worldItem.findItem.id === itemID) {
				this.zone.solved = true;
				worldItem.zone.solved = true;
			}

			engine.sceneManager.pushScene(pickupScene);
		}
	}

	private async _handlePlacedTile(): Promise<ScriptResult> {
		const inputManager = this.engine.inputManager;
		const tile = inputManager.placedTile;
		const location = inputManager.placedTileLocation;
		const heroLocation = this.engine.hero.location;

		if (!tile || !location) {
			return ScriptResult.Done;
		}

		if (tile.id === Yoda.ItemIDs.ThermalDetonator) {
			const scene = new DetonatorScene();
			scene.detonatorLocation = location;
			this.engine.inputManager.clear();
			this.engine.sceneManager.pushScene(scene);
			return ScriptResult.Void;
		}

		if (location.distanceTo(heroLocation) > Math.sqrt(2)) {
			this.engine.inputManager.clear();
			return ScriptResult.Done;
		}

		let acceptItem = false;

		for (const hotspot of this.zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!hotspot.location.isEqualTo(location)) continue;

			const worldLocation = this.engine.world.locationOfZone(this.zone);
			if (!worldLocation) {
				console.warn("Could not find world location for zone.");
			}
			const worldItem = this.engine.world.at(worldLocation);
			if (!worldItem) {
				console.warn("Could not find world item at", worldLocation);
			}
			const puzzle = this.engine.data.puzzles[worldItem.puzzleIndex];
			console.log("puzzle: ", this.engine.data.puzzles[worldItem.puzzleIndex]);
			console.log("or puzzle: ", this.engine.data.puzzles[worldItem.puzzleIndex]);

			if (tile !== worldItem.requiredItem) {
				console.warn("play sound no go");
				break;
			}

			continue;
			console.warn("show text", puzzle.strings[1]);
			console.warn("drop item", puzzle.item2);

			acceptItem = true;
		}

		if (acceptItem) {
			// TODO: remove item from inventory
		}

		// evaluate scripts
		this.engine.scriptExecutor.prepeareExecution(EvaluationMode.PlaceItem, this.zone);
		return await this.engine.scriptExecutor.execute();
	}

	private _evaluateZoneChangeHotspots(): boolean {
		if (![ZoneType.Town, ZoneType.TravelStart, ZoneType.TravelEnd].contains(this.zone.type)) {
			return;
		}

		for (const hotspot of this.zone.hotspots) {
			if (!hotspot.enabled) continue;
			if (!hotspot.location.isEqualTo(this.engine.hero.location)) continue;
			if ([HotspotType.VehicleTo, HotspotType.VehicleBack].contains(hotspot.type)) {
				this._useTransport(hotspot);
				return true;
			}
			if ([HotspotType.xWingToD, HotspotType.xWingFromD].contains(hotspot.type)) {
				this._useXWing(hotspot);
				return true;
			}
		}
		return false;
	}

	private _useTransport(_: Hotspot) {}

	private _useXWing(hotspot: Hotspot) {
		const engine = this.engine;

		switch (hotspot.type) {
			case HotspotType.xWingFromD: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				const transitionScene = new TransitionScene();
				transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				const otherHotspot = targetZone.hotspots.withType(HotspotType.xWingToD).first();
				transitionScene.targetHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				transitionScene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

				const world = engine.world;
				const location = world.locationOfZone(targetZone);
				if (!location) {
					// zone is not on the current planet
					return;
				}
				transitionScene.targetWorld = world;
				transitionScene.targetZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				this.engine.temporaryState.enteredByPlane = true;
				return true;
			}
			case HotspotType.xWingToD: {
				if (hotspot.arg === -1) console.warn("This is not where we're coming from!");

				const targetZone = engine.data.zones[hotspot.arg];

				const transitionScene = new TransitionScene();
				transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
				const otherHotspot = targetZone.hotspots.withType(HotspotType.xWingFromD).first();
				transitionScene.targetHeroLocation = otherHotspot
					? new Point(otherHotspot.x, otherHotspot.y)
					: new Point(0, 0);
				transitionScene.targetZone = targetZone;
				console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
				transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

				const location = engine.dagobah.locationOfZone(targetZone);
				if (!location) {
					// zone is not on dagobah
					return;
				}
				transitionScene.targetWorld = engine.dagobah;
				transitionScene.targetZoneLocation = location;
				engine.sceneManager.pushScene(transitionScene);
				this.engine.temporaryState.enteredByPlane = true;
				return true;
			}
		}
	}

	get zone() {
		return this._zone;
	}

	set zone(z) {
		console.warn(`Change zone to ${z.id.toHex(3)}`);
		this._zone = z;
		this.engine.camera.zoneSize = z.size;
	}

	get camera() {
		return this.engine.camera;
	}

	get currentOffset() {
		return this.engine.camera.offset;
	}
}

export default ZoneScene;
