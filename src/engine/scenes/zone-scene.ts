import { Direction, Point, Size } from "src/util";
import { EvaluationMode, ScriptResult } from "../script";
import { Zone, Tile, Char, Sound } from "src/engine/objects";
import { Direction as InputDirection } from "src/engine/input";
import { Renderer } from "src/engine/rendering";
import { Sprite } from "../rendering";
import { Yoda } from "src/engine/type";
import DetonatorScene from "./detonator-scene";
import Engine from "src/engine/engine";
import Hero from "src/engine/hero";
import MapScene from "./map-scene";
import moveMonster from "src/engine/monster-move";
import PauseScene from "./pause-scene";
import Scene from "./scene";
import ZoneSceneRenderer from "src/engine/rendering/zone-scene-renderer";
import moveHero from "src/engine/hero-move";
import moveBullets from "src/engine/bullet-move";
import { Channel } from "src/engine/audio";
import { HotspotExecutionMode } from "../script/hotspot-execution-mode";
import { HotspotExecutionResult } from "../script/hotspot-execution-result";

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

		engine.hotspotExecutor.execute(HotspotExecutionMode.Initialize);

		engine.scriptExecutor.prepeareExecution(EvaluationMode.Walk, this.zone);
		scriptResult = await engine.scriptExecutor.execute();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		let htspResult = engine.hotspotExecutor.execute(HotspotExecutionMode.Stand);
		if (
			htspResult & HotspotExecutionResult.Speak ||
			htspResult & HotspotExecutionResult.ChangeZone ||
			htspResult & HotspotExecutionResult.Drop
		)
			return;

		scriptResult = await moveBullets(engine, this.zone);
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

		htspResult = engine.hotspotExecutor.execute(HotspotExecutionMode.Stand);
		if (
			htspResult & HotspotExecutionResult.Speak ||
			htspResult & HotspotExecutionResult.ChangeZone ||
			htspResult & HotspotExecutionResult.Drop
		)
			return;
	}

	public render(renderer: Renderer) {
		const bulletTiles: Sprite[] = [];
		const hero = this.engine.hero;
		if (hero.isAttacking && hero.weapon) {
			let tile = this._extensionTileForBullet();
			if (tile) {
				const direction = Direction.Confine(hero.direction, false);
				const rel = Direction.CalculateRelativeCoordinates(direction, 1);
				const position = hero.location.byAdding(rel);
				const sprite = new Sprite(position, new Size(Tile.WIDTH, Tile.HEIGHT), tile.imageData);
				bulletTiles.push(sprite);
			}

			tile = this._bulletTileForBullet();
			if (tile) {
				const direction = Direction.Confine(hero.direction, false);
				const rel = Direction.CalculateRelativeCoordinates(direction, hero._actionFrames + 1);
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
		const direction = Direction.Confine(hero.direction, false);
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
		switch (Direction.Confine(direction, true)) {
			case Direction.SouthWest:
			case Direction.South:
			case Direction.SouthEast:
				return Char.FrameEntry.ExtensionDown;
			case Direction.NorthWest:
			case Direction.North:
			case Direction.NorthEast:
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
			case Direction.SouthWest:
			case Direction.SouthEast:
				return Char.FrameEntry.Down;
			case Direction.North:
			case Direction.NorthWest:
			case Direction.NorthEast:
				return Char.FrameEntry.Up;
			case Direction.East:
				return Char.FrameEntry.Right;
			case Direction.West:
				return Char.FrameEntry.Left;
		}
	}

	private _moveNPCs() {
		this._zone.monsters.forEach(npc => moveMonster(npc, this.zone, this.engine));
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

		if (inputManager.walk) await moveHero(hero.direction, this.zone, this.engine, this);

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

	private _placeBullet(hero: Hero) {
		hero.ammo--;
		if (hero.ammo === 0) this.reloadWeapon();
	}

	private reloadWeapon() {
		const engine = this.engine;
		const inventory = engine.inventory;
		const hero = engine.hero;
		const weapon = hero.weapon;

		const weaponTile = weapon.frames[0].extensionRight;
		inventory.removeItem(weaponTile);
		if (inventory.contains(weaponTile)) {
			engine.equip(weaponTile);
			hero.ammo = engine.type.getMaxAmmo(weapon);
		} else engine.equip(inventory.find(tile => tile.isWeapon()));
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

		if (location.isEqualTo(heroLocation)) {
			if (tile.isWeapon()) {
				engine.equip(tile);
			} else if (tile.isEdible()) {
				engine.consume(tile);
			} else {
				const nogo = engine.assets.get(Sound, engine.type.sounds.NoGo);
				engine.mixer.play(nogo, Channel.Effect);
			}

			engine.inputManager.clear();
			return ScriptResult.Done;
		}

		if (location.distanceTo(heroLocation) > Math.sqrt(2)) {
			engine.inputManager.clear();
			return ScriptResult.Done;
		}

		this.engine.hotspotExecutor.execute(HotspotExecutionMode.PlaceTile, location, tile);
		this.engine.scriptExecutor.prepeareExecution(EvaluationMode.PlaceItem, this.zone);
		return await this.engine.scriptExecutor.execute();
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
}

export default ZoneScene;
