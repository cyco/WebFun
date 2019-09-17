import { Direction, Point, Size } from "src/util";
import { EvaluationMode, ScriptResult } from "../script";
import { Hotspot, NPC, Zone, Tile, Char, Puzzle } from "src/engine/objects";
import { Direction as InputDirection } from "src/engine/input";
import { MutableHotspot } from "src/engine/mutable-objects";
import { NullIfMissing } from "src/engine/asset-manager";
import { Renderer } from "src/engine/rendering";
import { Sprite } from "../rendering";
import Sector from "src/engine/sector";
import { Yoda } from "src/engine/type";
import DetonatorScene from "./detonator-scene";
import Engine from "src/engine/engine";
import Hero from "src/engine/hero";
import MapScene from "./map-scene";
import moveNPC from "src/engine/npc-move";
import PauseScene from "./pause-scene";
import RoomTransitionScene from "./room-transition-scene";
import Scene from "./scene";
import ZoneSceneRenderer from "src/engine/rendering/zone-scene-renderer";
import ZoneTransitionScene from "./zone-transition-scene";

class ZoneScene extends Scene {
	private _zone: Zone;
	private _renderer = new ZoneSceneRenderer();

	constructor(engine: Engine = null, zone: Zone = null) {
		super();

		this._zone = zone;
		this.engine = engine;
	}

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

		engine.hotspotExecutor.uncoverSolvedHotspotItems(this.zone, this.engine);

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

		const stop = await this.handleInput();
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

	public render(renderer: Renderer) {
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
				return Char.FrameEntry.ExtensionDown;
			case Direction.North:
				return Char.FrameEntry.ExtensionUp;
			case Direction.East:
				return Char.FrameEntry.ExtensionRight;
			case Direction.West:
				return Char.FrameEntry.ExtensionLeft;
		}
	}

	private _frameLocationForDirection(direction: number) {
		switch (Direction.Confine(direction)) {
			case Direction.South:
				return Char.FrameEntry.Down;
			case Direction.North:
				return Char.FrameEntry.Up;
			case Direction.East:
				return Char.FrameEntry.Right;
			case Direction.West:
				return Char.FrameEntry.Left;
		}
	}

	private _tryTransition(direction: Point): boolean | undefined {
		const engine = this.engine;
		const hero = engine.hero;
		const currentZone = engine.currentZone;
		const targetLocation = Point.add(hero.location, direction);
		if (currentZone.bounds.contains(targetLocation)) {
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

		let world = engine.dagobah;
		if (world.findLocationOfZone(engine.currentZone) === null) {
			world = engine.world;
		}
		const zoneLocation = world.findLocationOfZone(engine.currentZone);
		if (!zoneLocation) return;

		const sector = world.at(zoneLocation);
		if (!sector || sector.zone !== engine.currentZone) {
			return;
		}

		const destinationZoneLocation = Point.add(zoneLocation, zoneDirection);
		const destinationZone = world.at(destinationZoneLocation).zone;
		if (!destinationZone) return false;

		const targetLocationOnCurrentZone = Point.add(hero.location, direction);
		if (currentZone.bounds.contains(targetLocationOnCurrentZone)) return false;

		const destinationHeroLocation = Point.add(hero.location, direction);
		destinationHeroLocation.subtract(zoneDirection.x * 18, zoneDirection.y * 18);

		if (!destinationZone.placeWalkable(destinationHeroLocation)) {
			return false;
		}

		const transitionScene = new ZoneTransitionScene();
		transitionScene.destinationHeroLocation = destinationHeroLocation;
		transitionScene.destinationZoneLocation = destinationZoneLocation;
		transitionScene.originZoneLocation = zoneLocation;
		transitionScene.destinationZone = destinationZone;
		transitionScene.destinationWorld = world;
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
			this.engine.inputManager.placedTile = hero.weapon.frames[0].tiles[Char.FrameEntry.ExtensionRight];
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

			if (npc.dropsLoot) this._dropLoot(npc);
		}
	}

	private _dropLoot(npc: NPC) {
		const hotspot = new MutableHotspot();
		hotspot.type = Hotspot.Type.CrateItem;
		hotspot.enabled = true;
		hotspot.location = npc.position;

		let itemId = -1;
		if (npc.loot > 0) itemId = npc.loot - 1;
		else {
			const hotspots = this._zone.hotspots
				.withType(Hotspot.Type.TriggerLocation)
				.filter(htsp => htsp.arg > 0);

			if (!hotspots.length) return;

			const hotspot = hotspots.first();
			itemId = hotspot.arg;
			hotspot.enabled = false;
		}

		if (itemId === -1) return;

		hotspot.arg = itemId;

		this.zone.hotspots.push(hotspot);

		const tile = this.assetManager.get(Tile, hotspot.arg);
		this.zone.setTile(tile, hotspot.location.x, hotspot.location.y, Zone.Layer.Object);
	}

	private _moveNPCs() {
		this._zone.npcs.forEach(npc => moveNPC(npc, this.zone, this.engine));
	}

	prepareCamera() {
		this.engine.camera.zoneSize = this.zone.size;
		this.engine.camera.update(Infinity);
	}

	willShow() {
		this.camera.hero = this.engine.hero;
	}

	willHide() {}

	private async handleInput(): Promise<boolean> {
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

		const inputDirections = inputManager.directions;
		if (inputDirections) {
			const point = new Point(0, 0);
			if (inputDirections & InputDirection.Up) {
				point.y -= 1;
			}
			if (inputDirections & InputDirection.Down) {
				point.y += 1;
			}
			if (inputDirections & InputDirection.Left) {
				point.x -= 1;
			}
			if (inputDirections & InputDirection.Right) {
				point.x += 1;
			}
			const direction = Direction.Confine(Direction.CalculateAngleFromRelativePoint(point));
			if (!isNaN(direction)) {
				hero.face(direction);
			}
		}

		if (inputManager.walk) await this._moveHero(hero.direction);

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
		const targetTile =
			zone.bounds.contains(targetPoint) &&
			zone.getTile(targetPoint.x, targetPoint.y, Zone.Layer.Object);

		if (targetTile) {
			// TODO: get rid of temporary state
			engine.temporaryState.bump = targetPoint;
			this.evaluateBumpHotspots(targetPoint, engine);

			engine.scriptExecutor.prepeareExecution(EvaluationMode.Bump, this.zone);

			const quest = this.engine.currentWorld.findSectorContainingZone(this.zone);
			if (quest && quest.npc && quest.npc.id === targetTile.id) {
				this._bumpPuzzleNPC(quest, targetPoint);
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
		} else this.engine.hotspotExecutor.triggerBumpHotspots(this.zone, this.engine);
	}

	private _placeBullet(hero: Hero) {
		hero.ammo--;
		if (hero.ammo === 0) this.reloadWeapon();
	}

	private _bumpPuzzleNPC(sector: Sector, place: Point) {
		const puzzleIndex = sector.puzzleIndex;
		let puzzle: Puzzle = null;

		if (puzzleIndex === -1) {
			puzzle = this.engine.story.goal;
			let text = "";
			let item: Tile = null;
			if (sector.zone.solved) {
				text = puzzle.strings[2];
			} else {
				text = puzzle.strings[3];
				item = sector.findItem;
			}

			if (text.length) {
				this.engine
					.speak(text, place)
					.then(async () => !item || (await this.engine.dropItem(item, place)))
					.then(() => (this.zone.solved = true));
			}

			return;
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
			const currentTile = this.zone.getTileID(at.x, at.y, Zone.Layer.Object);
			if (currentTile !== itemID) return;

			this.zone.setTile(null, at.x, at.y, Zone.Layer.Object);
			this.engine.dropItem(engine.assetManager.get(Tile, itemID), at).then(() => {
				const sector = this.engine.currentWorld.findSectorContainingZone(this.zone);
				if (sector && sector.findItem && sector.findItem.id === itemID) {
					this.zone.solved = true;
					sector.zone.solved = true;
				}

				hotspot.enabled = false;
			});
		}
	}

	private async _handlePlacedTile(): Promise<ScriptResult> {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		const tile = inputManager.placedTile;
		const location = inputManager.placedTileLocation;
		const heroLocation = engine.hero.location;

		if (!tile || !location) {
			return ScriptResult.Done;
		}

		if (tile.id === Yoda.tileIDs.ThermalDetonator) {
			const scene = new DetonatorScene();
			scene.detonatorLocation = location;
			engine.inputManager.clear();
			engine.sceneManager.pushScene(scene);
			return ScriptResult.Void;
		}

		if (location.distanceTo(heroLocation) > Math.sqrt(2)) {
			engine.inputManager.clear();
			return ScriptResult.Done;
		}

		this.engine.hotspotExecutor.triggerPlaceHotspots(tile, location, this.zone, engine);
		this.engine.scriptExecutor.prepeareExecution(EvaluationMode.PlaceItem, this.zone);
		return await this.engine.scriptExecutor.execute();
	}

	private _evaluateZoneChangeHotspots(): boolean {
		return this.engine.hotspotExecutor.evaluateZoneChangeHotspots(
			this.engine.hero.location,
			this.zone,
			this.engine
		);
	}

	get zone() {
		return this._zone;
	}

	set zone(z) {
		this._zone = z;
		this.engine.camera.zoneSize = z.size;
	}

	get camera() {
		return this.engine.camera;
	}

	get currentOffset() {
		return this.engine.camera.offset;
	}

	private get assetManager() {
		return this.engine.assetManager;
	}
}

export default ZoneScene;
