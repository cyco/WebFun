import { CheatCodeInput, Invincibility, RequiredItems, UnlimitedAmmo, Weapons } from "src/engine/cheats";
import { Point, Size } from "src/util";
import { Tile, Zone } from "src/engine/objects";

import Renderer from "../rendering/renderer";
import LocatorTile from "src/engine/type/yoda/locator-tile";
import Scene from "./scene";
import Settings from "src/settings";
import SpeechScene from "./speech-scene";
import RoomTransitionScene from "./room-transition-scene";
import World from "src/engine/world";
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
	Town = 57363,
	aMap = 57360,
	TheForce = 57362,
	SomethingUseful = 57361
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
		this._location = this.engine.assets.get(Tile, this._locatorTile.here);
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
			this._showText(
				cheatMessages.first(),
				this.engine.currentWorld.findLocationOfZone(this.engine.currentZone)
			);
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

		const worldHeightPx = World.Size.height * MapTileHeight;
		const worldWidthPx = World.Size.width * MapTileWidth;

		const offsetX = (ViewWidth - worldWidthPx) / (2 * ViewWidth);
		const offsetY = (ViewHeight - worldHeightPx) / (2 * ViewHeight) - 1.5 * Tile.HEIGHT;

		speechScene.offset = new Point(offsetX, offsetY);

		this.engine.sceneManager.pushScene(speechScene);
	}

	protected mouseDown(p: Point): void {
		const worldHeightPx = World.Size.height * MapTileHeight;
		const worldWidthPx = World.Size.width * MapTileWidth;

		const offsetX = (ViewWidth - worldWidthPx) / (2 * ViewWidth);
		const offsetY = (ViewHeight - worldHeightPx) / (2 * ViewHeight);

		p.x -= offsetX;
		p.y -= offsetY;

		p.x *= 1 + offsetX * 2;
		p.y *= 1 + offsetY * 2;

		if (p.x < 0 || p.y < 0 || p.x >= 1 || p.y >= 1) {
			return;
		}

		const tileX = Math.floor(p.x * World.Size.width);
		const tileY = Math.floor(p.y * World.Size.height);

		const sector = this.engine.currentWorld.at(tileX, tileY);
		if (!sector || !sector.zone) {
			return this.exitScene();
		}

		if (Settings.debug && this.engine.inputManager.drag) {
			return this.performDebugTeleportAndExit(sector.zone);
		}

		if (!this.isZoneConsideredVisited(sector.zone)) {
			return this.exitScene();
		}

		this.handleMouseDown(new Point(tileX, tileY), sector.zone);
	}

	protected handleMouseDown(point: Point, _: Zone) {
		const message = this._locatorDescription(point);
		if (!message) return this.exitScene();

		this._showText(message, point);
	}

	private performDebugTeleportAndExit(zone: Zone) {
		const engine = this.engine;
		this.exitScene();

		const transitionScene = new RoomTransitionScene();
		transitionScene.destinationHeroLocation = engine.hero.location;
		transitionScene.destinationZone = zone;
		transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;
		transitionScene.destinationWorld = engine.currentWorld;
		transitionScene.destinationZoneLocation = engine.currentWorld.findLocationOfZone(zone);
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
		const sector = this.engine.currentWorld.at(at.x, at.y);
		if (!sector || !sector.zone) return StringID.None;
		if (!sector.zone.visited && !Settings.revealWorld) return -2;

		const requires = sector.requiredItem;
		const gives = sector.findItem;
		console.log(
			[requires ? `requires ${requires.name}` : null, gives ? `gives ${gives.name}` : null]
				.filter(i => i)
				.join(", ")
		);

		const typeForTile = (tile: Tile): number => {
			if (tile.isTool()) return StringID.aTool;
			if (tile.isPart()) return StringID.aPart;
			if (tile.isValuable()) return StringID.aValuable;
			if (tile.isKeycard()) return StringID.aKeyCard;
			if (tile.isLocator()) return StringID.aMap;
			if (tile.isWeapon()) return StringID.TheForce;
			if (tile.isItem()) return StringID.SomethingUseful;

			return StringID.aUnknown;
		};

		switch (sector.zone.type) {
			case Zone.Type.Empty:
				return StringID.None;
			case Zone.Type.Town:
				return StringID.Town;
			case Zone.Type.BlockadeNorth:
			case Zone.Type.BlockadeSouth:
			case Zone.Type.BlockadeEast:
			case Zone.Type.BlockadeWest:
			case Zone.Type.TravelStart:
			case Zone.Type.TravelEnd:
				if (!sector.requiredItem) return StringID.None;
				if (sector.solved1) return StringID.TravelSolved;
				return [StringID.requires, typeForTile(sector.requiredItem)];
			case Zone.Type.Goal:
				if (sector.solved1 && sector.solved2) return StringID.GoalSolved;
				return StringID.aUnknown;
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				if (!sector.findItem) return StringID.None;
				if (sector.solved1) return StringID.Solved;
				if (sector.findItem.isLocator()) return [StringID.find, StringID.aMap];
				if (sector.findItem.isWeapon()) return [StringID.find, StringID.TheForce];
				if (sector.findItem.isItem()) return [StringID.find, StringID.SomethingUseful];
				console.assert(false, "Unknown find item!");
			case Zone.Type.Trade:
				if (!sector.requiredItem) return StringID.None;
				if (sector.solved2) return StringID.Solved;
				return [StringID.requires, typeForTile(sector.requiredItem)];
			case Zone.Type.Use:
				if (!sector.requiredItem) return StringID.None;
				if (sector.solved2) return StringID.Solved;
				return [StringID.requires, sector.requiredItem.name];

			case Zone.Type.Load:
			case Zone.Type.Room:
			case Zone.Type.Win:
			case Zone.Type.Lose:
			case Zone.Type.None:
			default:
				console.assert(false, "Zone does not appear on map!");
				return StringID.None;
		}
	}

	protected exitScene() {
		this.engine.sceneManager.popScene();
	}

	render(renderer: Renderer): void {
		const engine = this.engine;
		const palette = this.engine.palette.current;
		const TileWidth = Tile.WIDTH;
		const MapWidth = 10;
		const MapHeight = 10;
		const MapTileWidth = 28;
		const MapTileHeight = 28;

		const state = engine.temporaryState;
		const world = engine.currentWorld;
		const offsetX = (288 - World.Size.width * MapTileWidth) / 2;
		const offsetY = (288 - World.Size.height * MapTileHeight) / 2;
		const result = new ImageData(288, 288);
		const buffer = new ArrayBuffer(result.data.length);
		const byteArray = new Uint8Array(buffer);
		const data = new Uint32Array(buffer);

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
				const zone = world.at(x, y).zone;
				const tile = this._tileForZone(zone);
				if (!tile) continue;
				if (tile.isOpaque()) drawOpaqueTileAt(tile, x, y);
				else drawTileAt(tile, x, y);
			}
		}

		const { location } = engine.findLocationOfZone(engine.currentZone);

		if (
			(this._ticks % (2 * MapScene.LOCATOR_ANIMATION_TICKS)) / MapScene.LOCATOR_ANIMATION_TICKS < 1 &&
			location
		) {
			if (this._location) drawTileAt(this._location, location.x, location.y);
		}

		result.data.set(byteArray);
		renderer.renderImageData(result, 0, 0);
		return;
	}

	private _tileForZone(zone: Zone): Tile {
		let tile = this._locatorTile.forZone(zone, zone && zone.visited, Settings.revealWorld);
		if (tile instanceof Array) tile = tile[zone && this.isZoneConsideredSolved(zone) ? 1 : 0];

		return this.engine.assets.get(Tile, tile);
	}

	protected isZoneConsideredSolved(zone: Zone): boolean {
		const sector = this.engine.currentWorld.findSectorContainingZone(zone);
		return sector && sector.solved;
	}

	protected isZoneConsideredVisited(zone: Zone) {
		return zone.visited || Settings.revealWorld;
	}
}

export default MapScene;
