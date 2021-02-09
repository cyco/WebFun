import { Direction, Point, Size } from "src/util";
import { EvaluationMode, ScriptResult } from "../script";
import { Zone, Tile, Char, Sound } from "src/engine/objects";
import { InputMask } from "src/engine/input";
import { Renderer } from "src/engine/rendering";
import { Sprite } from "../rendering";
import { Yoda } from "src/engine/variant";
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
import Camera from "../camera";

class ZoneScene extends Scene {
	private _zone: Zone;
	private _renderer = new ZoneSceneRenderer();

	constructor(engine: Engine = null, zone: Zone = null) {
		super();

		this._zone = zone;
		this.engine = engine;
	}

	public async update(ticks: number): Promise<void> {
		this.engine.palette.step();

		const engine = this.engine;
		const hero = engine.hero;
		hero.isWalking = false;
		let scriptResult = await engine.spu.run();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		scriptResult = await this._handlePlacedTile();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		let htspResult = engine.hpu.execute(HotspotExecutionMode.Initialize);
		if (
			htspResult & HotspotExecutionResult.Speak ||
			htspResult & HotspotExecutionResult.ChangeZone ||
			htspResult & HotspotExecutionResult.Drop
		) {
			return;
		}

		engine.spu.prepareExecution(EvaluationMode.Walk, this.zone);
		scriptResult = await engine.spu.run();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		htspResult = engine.hpu.execute(HotspotExecutionMode.Stand);
		if (
			htspResult & HotspotExecutionResult.Speak ||
			htspResult & HotspotExecutionResult.ChangeZone ||
			htspResult & HotspotExecutionResult.Drop
		) {
			return;
		}

		scriptResult = await moveBullets(engine, this.zone);
		if (scriptResult !== ScriptResult.Done) {
			return;
		}
		this._moveMonsters();

		const stop = await this.handleInput(ticks);
		if (stop) return;

		this.engine.camera.update(ticks);
		hero.update(ticks);
		scriptResult = await engine.spu.run();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		engine.spu.prepareExecution(EvaluationMode.Walk, this.zone);
		scriptResult = await engine.spu.run();
		if (scriptResult !== ScriptResult.Done) {
			return;
		}

		htspResult = engine.hpu.execute(HotspotExecutionMode.Stand);
		if (
			htspResult & HotspotExecutionResult.Speak ||
			htspResult & HotspotExecutionResult.ChangeZone ||
			htspResult & HotspotExecutionResult.Drop
		) {
			return;
		}
	}

	public render(renderer: Renderer): void {
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

		this._renderer.render(
			this._zone,
			this.engine,
			renderer,
			this.engine.palette.current,
			bulletTiles
		);
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

	private _moveMonsters() {
		this._zone.monsters.forEach(monster => moveMonster(monster, this.zone, this.engine));
	}

	prepareCamera(): void {
		this.engine.camera.zoneSize = this.zone.size;
		this.engine.camera.update(Infinity);
	}

	public willShow(): void {
		this.camera.hero = this.engine.hero;
	}

	private async handleInput(ticks: number): Promise<boolean> {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		const hero = engine.hero;
		const input = inputManager.readInput(ticks);

		if (input & InputMask.Pause) {
			const pauseScene = new PauseScene();
			this.engine.sceneManager.pushScene(pauseScene);
			return true;
		}

		if (input & InputMask.Locator) {
			// && hero.hasLocator();
			const mapScene = new MapScene();
			this.engine.sceneManager.pushScene(mapScene);
			return true;
		}

		if (hero.isAttacking) return false;

		hero.isDragging = !!(input & InputMask.Drag);
		hero.isAttacking = !!(input & InputMask.Attack);
		if (hero.isAttacking) this._attackTriggered();
		if (hero.isAttacking) {
			hero._actionFrames = 0;
			hero.isWalking = false;
			hero.isDragging = false;

			this._placeBullet(hero);

			const weaponIcon = hero.weapon.getWeaponIcon();
			console.assert(!!weaponIcon);

			const point = Direction.CalculateRelativeCoordinates(hero.direction, 1);
			const inertia = new Point(point.x, point.y, 0);
			const target = Point.add(hero.location, inertia);

			this.engine.inputManager.placedTile = weaponIcon;
			this.engine.inputManager.placedTileLocation = target;

			return true;
		}

		if (input) {
			const point = new Point(0, 0);
			if (input & InputMask.Up) {
				point.y -= 1;
			}
			if (input & InputMask.Down) {
				point.y += 1;
			}
			if (input & InputMask.Left) {
				point.x -= 1;
			}
			if (input & InputMask.Right) {
				point.x += 1;
			}
			const direction = Direction.Confine(Direction.CalculateAngleFromRelativePoint(point));
			if (!isNaN(direction)) {
				hero.face(direction);
			}
		}

		if (input & InputMask.Walk) {
			const result = await moveHero(hero.direction, this.zone, this.engine, this);
			if (result !== ScriptResult.Done) {
				return true;
			}
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
			return ScriptResult.Done;
		}

		// do nothing if hero is looking away from the zone
		const point = Direction.CalculateRelativeCoordinates(hero.direction, 1);
		const inertia = new Point(point.x, point.y, 0);
		const target = Point.add(hero.location, inertia);
		if (!target.isInBounds(zone.size)) {
			hero.isAttacking = false;
			return ScriptResult.Done;
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
			hero.ammo = engine.variant.getMaxAmmo(weapon);
		} else engine.equip(inventory.find(tile => tile.hasAttributes(Tile.Attributes.Weapon)));
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

			this.engine.inventory.removeItem(Yoda.tileIDs.ThermalDetonator);
			this.engine.inputManager.clear();
			this.engine.inputManager.placedTile = null;
			this.engine.inputManager.placedTileLocation = null;
			engine.sceneManager.pushScene(scene);

			return ScriptResult.UpdateScene;
		}

		if (location.isEqualTo(new Point(heroLocation.x, heroLocation.y))) {
			if (tile.hasAttributes(Tile.Attributes.Weapon)) {
				engine.equip(tile);
			} else if (tile.hasAttributes(Tile.Attributes.Edible)) {
				engine.consume(tile);
			} else {
				const nogo = engine.assets.get(Sound, engine.variant.sounds.NoGo);
				engine.mixer.play(nogo, Channel.Effect);
			}

			inputManager.clear();

			return ScriptResult.Done;
		}

		if (location.distanceTo(heroLocation) > Math.sqrt(2)) {
			inputManager.clear();

			return ScriptResult.Done;
		}

		const htspResult = this.engine.hpu.execute(HotspotExecutionMode.PlaceTile, location, tile);

		if (
			htspResult & HotspotExecutionResult.Speak ||
			htspResult & HotspotExecutionResult.ChangeZone ||
			htspResult & HotspotExecutionResult.Drop
		) {
			return ScriptResult.Void;
		}

		this.engine.spu.prepareExecution(EvaluationMode.PlaceItem, this.zone);
		return await this.engine.spu.run();
	}

	get zone(): Zone {
		return this._zone;
	}

	set zone(z: Zone) {
		this._zone = z;
		this.engine.camera.zoneSize = z.size;
	}

	get camera(): Camera {
		return this.engine.camera;
	}

	get currentOffset(): Point {
		return this.engine.camera.offset;
	}
}

export default ZoneScene;
