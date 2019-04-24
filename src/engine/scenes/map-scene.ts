import { CheatCodeInput, Invincibility, RequiredItems, UnlimitedAmmo, Weapons } from "src/engine/cheats";
import { Point, Size } from "src/util";
import { Tile, ZoneType } from "src/engine/objects";

import AbstractRenderer from "../rendering/abstract-renderer";
import LocatorTile from "src/engine/type/yoda/locator-tile";
import { Planet } from "src/engine/types";
import Scene from "./scene";
import Settings from "src/settings";
import SpeechScene from "./speech-scene";
import TransitionScene from "./transition-scene";
import { World } from "src/engine/generation";
import Zone from "../objects/zone";
import ZoneScene from "./zone-scene";

const MapTileWidth = 28;
const MapTileHeight = 28;

const ViewWidth = 288;
const ViewHeight = 288;

const enum StringID {
	None = -1,

	requires = 57358,
	find = 57359,
	aPart = 57367,
	aValuable = 57368,
	aKeyCard = 57369,
	aTool = 57366,
	aUnknown = 57365,

	Solved = 57357,
	TravelSolved = 57370,
	GoalSolved = 57364,
	Town = 57363
}

class MapScene extends Scene {
	static readonly LOCATOR_ANIMATION_TICKS = 10;
	private _ticks: number = 0;
	private _location: Tile = null;
	private _cheatInput = new CheatCodeInput([
		new Weapons(),
		new UnlimitedAmmo(),
		new Invincibility(),
		new RequiredItems()
	]);
	private _locatorTile = new LocatorTile();

	isOpaque() {
		return true;
	}

	willShow() {
		this._cheatInput.reset();

		this._ticks = 4;
		this._location = this.engine.data.tiles[this._locatorTile.here];
		this.engine.inputManager.clear();
		this.engine.inputManager.mouseDownHandler = (p: Point) => this.mouseDown(p);
		this.engine.inputManager.keyDownHandler = (e: KeyboardEvent) => {
			this._cheatInput.addCharacter(String.fromCharCode(e.keyCode).toLowerCase());
		};
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = () => void 0;
		this.engine.inputManager.keyDownHandler = () => void 0;
		this.engine.inputManager.clear();
	}

	async update(/*ticks*/) {
		const engine = this.engine;
		if (engine.inputManager.locator) {
			this.exitScene();
			return;
		}

		const cheatMessages = this._cheatInput.execute(engine);
		if (cheatMessages.length) {
			this._cheatInput.reset();
			this._showText(cheatMessages.first(), this.engine.temporaryState.worldLocation);
		}

		this._ticks++;
	}

	private _showText(text: string, location: Point): void {
		const speechScene = new SpeechScene(this.engine);
		speechScene.text = text;

		// HACK: Work against camera offset correction
		location = location.bySubtracting(this.cameraOffset);

		speechScene.location = location;
		speechScene.tileSize = new Size(MapTileWidth, MapTileHeight);

		const worldHeightPx = World.HEIGHT * MapTileHeight;
		const worldWidthPx = World.WIDTH * MapTileWidth;

		const offsetX = (ViewWidth - worldWidthPx) / (2 * ViewWidth);
		const offsetY = (ViewHeight - worldHeightPx) / (2 * ViewHeight) - 1.5 * Tile.HEIGHT;

		speechScene.offset = new Point(offsetX, offsetY);

		this.engine.sceneManager.pushScene(speechScene);
	}

	protected mouseDown(p: Point): void {
		const worldHeightPx = World.HEIGHT * MapTileHeight;
		const worldWidthPx = World.WIDTH * MapTileWidth;

		const offsetX = (ViewWidth - worldWidthPx) / (2 * ViewWidth);
		const offsetY = (ViewHeight - worldHeightPx) / (2 * ViewHeight);

		p.x -= offsetX;
		p.y -= offsetY;

		p.x *= 1 + offsetX * 2;
		p.y *= 1 + offsetY * 2;

		if (p.x < 0 || p.y < 0 || p.x >= 1 || p.y >= 1) {
			return;
		}

		const tileX = Math.floor(p.x * World.WIDTH);
		const tileY = Math.floor(p.y * World.HEIGHT);

		const engine = this.engine;
		const currentZone = engine.currentZone;
		let world = this.engine.world;
		if (currentZone.planet === Planet.DAGOBAH) {
			world = this.engine.dagobah;
		}
		const zone = world.getZone(tileX, tileY);
		if (!zone) {
			return this.exitScene();
		}

		if (Settings.debug && this.engine.inputManager.drag && zone) {
			return this.performDebugTeleportAndExit(zone);
		}

		if (!this.isZoneConsideredVisited(zone)) {
			return this.exitScene();
		}

		this.handleMouseDown(new Point(tileX, tileY), zone);
	}

	protected handleMouseDown(point: Point, _: Zone) {
		const message = this._locatorDescription(point);
		if (!message) return this.exitScene();

		this._showText(message, point);
	}

	private performDebugTeleportAndExit(zone: Zone) {
		const engine = this.engine;
		this.exitScene();

		const transitionScene = new TransitionScene();
		transitionScene.type = TransitionScene.TRANSITION_TYPE.ROOM;
		transitionScene.targetHeroLocation = engine.hero.location;
		transitionScene.targetZone = zone;
		transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;

		let world = engine.dagobah;
		let location = world.locationOfZone(transitionScene.targetZone);
		if (!location) {
			world = engine.world;
			location = world.locationOfZone(transitionScene.targetZone);
		}
		transitionScene.targetWorld = world;

		if (!location) {
			location = null;
		}
		transitionScene.targetZoneLocation = location;
		engine.sceneManager.pushScene(transitionScene);
	}

	private _locatorDescription(at: Point): string {
		const strings = this.engine.type.strings;
		const string = this._locatorDescriptionId(at);
		if (typeof string === "number") return strings[string];
		if (typeof string === "string") return string;

		return string.map(string => (typeof string === "string" ? string : strings[string])).join("") + "!";
	}

	private _locatorDescriptionId(at: Point): (number | string) | (number | string)[] {
		const worldItem = this.engine.currentWorld.at(at.x, at.y);
		if (!worldItem || !worldItem.zone) return StringID.None;
		if (!worldItem.zone.visited && !Settings.revealWorld) return -2;

		const typeForTile = (tile: Tile): number => {
			const attributes = tile.attributes;
			if (attributes & 0x20000) return StringID.aTool;
			if (attributes & 0x40000) return StringID.aPart;
			if (attributes & 0x80000) return StringID.aValuable;
			if (attributes & 0x10000) {
				if (tile.id === 531 || tile.id === 645 || tile.id === 1087 || tile.id === 1075) {
					return StringID.aTool;
				}
				return StringID.aKeyCard;
			}

			return StringID.aUnknown;
		};

		switch (worldItem.zone.type) {
			case ZoneType.Empty:
				return StringID.None;
			case ZoneType.Town:
				return StringID.Town;
			case ZoneType.BlockadeNorth:
			case ZoneType.BlockadeSouth:
			case ZoneType.BlockadeEast:
			case ZoneType.BlockadeWest:
			case ZoneType.TravelStart:
			case ZoneType.TravelEnd:
				if (!worldItem.requiredItem) return StringID.None;
				if (worldItem.zone.solved) return StringID.TravelSolved;
				return [StringID.requires, typeForTile(worldItem.requiredItem)];
			case ZoneType.Goal:
				if (worldItem.zone.solved) return StringID.GoalSolved;
				return StringID.aUnknown;
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				if (!worldItem.findItem) return StringID.None;
				if (worldItem.zone.solved) return StringID.Solved;
				if (worldItem.findItem.attributes & 0x10000) return [StringID.find, 57360];
				if (worldItem.findItem.attributes & 0x40) return [StringID.find, 57362];
				if (worldItem.findItem.attributes & 0x80) return [StringID.find, 57361];
				console.assert(false, "Unknown find item!");
			case ZoneType.Trade:
				if (!worldItem.requiredItem) return StringID.None;
				if (worldItem.zone.solved) return StringID.Solved;
				return [StringID.requires, typeForTile(worldItem.requiredItem)];
			case ZoneType.Use:
				if (!worldItem.requiredItem) return StringID.None;
				if (worldItem.zone.solved) return StringID.Solved;
				return [StringID.find, worldItem.requiredItem.name];

			case ZoneType.Load:
			case ZoneType.Room:
			case ZoneType.Win:
			case ZoneType.Lose:
			case ZoneType.None:
			default:
				console.assert(false, "Zone does not appear on map!");
				return StringID.None;
		}
	}

	protected exitScene() {
		this.engine.sceneManager.popScene();
	}

	render(renderer: AbstractRenderer): void {
		const engine = this.engine;
		const palette = this.engine.palette.current;
		const TileWidth = Tile.WIDTH;
		const MapWidth = 10;
		const MapHeight = 10;
		const MapTileWidth = 28;
		const MapTileHeight = 28;

		const state = engine.temporaryState;
		const currentZone = engine.currentZone;
		let world = engine.world;

		if (currentZone.planet === Planet.DAGOBAH) {
			world = engine.dagobah;
		}
		const offsetX = (288 - World.WIDTH * MapTileWidth) / 2;
		const offsetY = (288 - World.HEIGHT * MapTileHeight) / 2;
		const result = new ImageData(288, 288);
		var buffer = new ArrayBuffer(result.data.length);
		var byteArray = new Uint8Array(buffer);
		var data = new Uint32Array(buffer);

		const bpr = 288;
		const drawOpaqueTileAt = (tile: Tile, x: number, y: number) => {
			const pixels = tile.imageData;
			let tx, ty;
			let j = y * MapTileHeight * bpr + x * MapTileWidth;
			for (ty = 0; ty < MapTileHeight; ty++) {
				for (tx = 0; tx < MapTileWidth; tx++) {
					data[j + tx + offsetY * bpr + offsetX] = palette[pixels[ty * TileWidth + tx]];
				}
				j += bpr;
			}
		};

		const drawTileAt = (tile: Tile, x: number, y: number) => {
			const pixels = tile.imageData;
			let tx, ty;
			let j = y * MapTileHeight * bpr + x * MapTileWidth;
			for (ty = 0; ty < MapTileHeight; ty++) {
				for (tx = 0; tx < MapTileWidth; tx++) {
					const paletteIndex = pixels[ty * TileWidth + tx];
					if (paletteIndex === 0) continue;
					data[j + tx + offsetY * bpr + offsetX] = palette[paletteIndex];
				}
				j += bpr;
			}
		};

		let x, y;
		for (y = 0; y < MapHeight; y++) {
			for (x = 0; x < MapWidth; x++) {
				const zone = world.getZone(x, y);
				const tile = this._tileForZone(zone);
				if (!tile) continue;
				if (tile.isOpaque()) drawOpaqueTileAt(tile, x, y);
				else drawTileAt(tile, x, y);
			}
		}

		if ((this._ticks % (2 * MapScene.LOCATOR_ANIMATION_TICKS)) / MapScene.LOCATOR_ANIMATION_TICKS < 1) {
			if (this._location) drawTileAt(this._location, state.worldLocation.x, state.worldLocation.y);
		}

		result.data.set(byteArray);
		(renderer as any).renderImageData(result, 0, 0);
		return;
	}

	private _tileForZone(zone: Zone): Tile {
		let tile = this._locatorTile.forZone(zone, zone && zone.visited, Settings.revealWorld);
		if (tile instanceof Array) tile = tile[zone && this.isZoneConsideredSolved(zone) ? 1 : 0];

		return this.engine.data.tiles[tile];
	}

	protected isZoneConsideredSolved(zone: Zone): boolean {
		return zone.solved;
	}

	protected isZoneConsideredVisited(zone: Zone) {
		return zone.visited || Settings.revealWorld;
	}
}

export default MapScene;
