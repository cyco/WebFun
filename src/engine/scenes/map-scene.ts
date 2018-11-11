import { CheatCodeInput, Invincibility, UnlimitedAmmo, Weapons } from "src/engine/cheats";
import { World } from "src/engine/generation";
import { Tile, ZoneType } from "src/engine/objects";
import { Planet } from "src/engine/types";
import LocatorTile from "src/engine/type/yoda/locator-tile";
import Settings from "src/settings";
import { Point, Size } from "src/util";
import Zone from "../objects/zone";
import AbstractRenderer from "../rendering/abstract-renderer";
import Scene from "./scene";
import SpeechScene from "./speech-scene";

const TileWidth = 28;
const TileHeight = 28;

class MapScene extends Scene {
	static readonly LOCATOR_TICKS = 10;
	private _ticks: number = 0;
	private _location: Tile = null;
	private _cheatInput = new CheatCodeInput([new Weapons(), new UnlimitedAmmo(), new Invincibility()]);
	private _locatorTile = new LocatorTile();

	isOpaque() {
		return true;
	}

	willShow() {
		this._cheatInput.reset();

		this._ticks = 4;
		this._location = this.engine.data.tiles[this._locatorTile.here];
		this.engine.inputManager.mouseDownHandler = (p: Point) => this.mouseDown(p);
		this.engine.inputManager.keyDownHandler = (e: KeyboardEvent) => {
			this._cheatInput.addCharacter(String.fromCharCode(e.keyCode).toLowerCase());
		};
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = () => void 0;
		this.engine.inputManager.keyDownHandler = () => void 0;
	}

	async update(/*ticks*/) {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		if (!inputManager.locator) {
			engine.sceneManager.popScene();
		}

		let cheatMessages = this._cheatInput.execute(engine);
		if (cheatMessages.length) {
			this._cheatInput.reset();
			this._showText(cheatMessages.first(), this.engine.temporaryState.worldLocation);
		}

		this._ticks++;
	}

	private _showText(text: string, location: Point): void {
		const speechScene = new SpeechScene(this.engine);
		speechScene.text = text;
		speechScene.location = location;
		speechScene.tileSize = new Size(Tile.WIDTH, Tile.HEIGHT);

		this.engine.sceneManager.pushScene(speechScene);
	}

	mouseDown(p: Point): void {
		const viewWidth = 288;
		const viewHeight = 288;

		const worldHeightPx = World.HEIGHT * Tile.HEIGHT;
		const worldWidthPx = World.WIDTH * Tile.WIDTH;

		const offsetX = (viewWidth - worldWidthPx) / (2 * viewWidth);
		const offsetY = (viewHeight - worldHeightPx) / (2 * viewHeight);

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
		if (!zone || (!Settings.revealWorld && !zone.visited) || zone.type === ZoneType.Empty) {
			this._exitScene();
			return;
		}

		let message = this._locatorDescription(new Point(tileX, tileY));
		console.log(message);
	}

	private _locatorDescription(at: Point): string {
		const strings = this.engine.type.strings;
		const string = this._locatorDescriptionId(at);
		if (typeof string === "number") return strings[string];
		if (typeof string === "string") return string;

		return string.map(string => (typeof string === "string" ? string : strings[string])).join(" ");
	}

	private _locatorDescriptionId(at: Point): (number | string) | (number | string)[] {
		const worldItem = this.engine.currentWorld.at(at.x, at.y);
		if (!worldItem || !worldItem.zone) return -1;
		if (!worldItem.zone.visited) return -2;

		const requires = 57358;
		const find = 57359;
		const typeForTile = (tile: Tile): number => {
			const aPart = 57367;
			const aValuable = 57368;
			const aKeyCard = 57369;
			const aTool = 57366;
			const aUnknown = 57365;

			const attributes = tile.attributes;
			if (attributes & 0x20000) return aTool;
			if (attributes & 0x40000) return aPart;
			if (attributes & 0x80000) return aValuable;
			if (attributes & 0x10000) {
				if (tile.id == 531 || tile.id == 645 || tile.id == 1087 || tile.id == 1075) {
					return aTool;
				}
				return aKeyCard;
			}

			return aUnknown;
		};

		switch (worldItem.zone.type) {
			case ZoneType.Empty:
				return -1;
			case ZoneType.Town:
				return 57363;
			case ZoneType.BlockadeNorth:
			case ZoneType.BlockadeSouth:
			case ZoneType.BlockadeEast:
			case ZoneType.BlockadeWest:
			case ZoneType.TravelStart:
			case ZoneType.TravelEnd:
				if (worldItem.zone.solved) return 57370;
				return [requires, typeForTile(worldItem.requiredItem)];
			case ZoneType.Goal:
				if (worldItem.zone.solved) return 57364;
				return 57365;
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				if (worldItem.zone.solved) return 57357;
				if (worldItem.findItem.attributes & 0x10000) return 57360;
				if (worldItem.findItem.attributes & 0x40) return 57362;
				if (worldItem.findItem.attributes & 0x80) return 57361;
				console.assert(false, "Unknown find item!");
			case ZoneType.Trade:
				if (worldItem.zone.solved) return 57357;
				return [requires, typeForTile(worldItem.requiredItem)];
			case ZoneType.Use:
				if (worldItem.zone.solved) return 57357;
				return [find, worldItem.requiredItem.name];

			case ZoneType.Load:
			case ZoneType.Room:
			case ZoneType.Win:
			case ZoneType.Lose:
			case ZoneType.None:
			default:
				console.assert(false, "Zone does not appear on map!");
				return -1;
		}
	}

	private _exitScene() {
		this.engine.sceneManager.popScene();
	}

	render(renderer: AbstractRenderer): void {
		renderer.clear();

		const engine = this.engine;
		const state = engine.temporaryState;
		const currentZone = engine.currentZone;
		let world = engine.world;

		if (currentZone.planet === Planet.DAGOBAH) {
			world = engine.dagobah;
		}

		const offsetX = (288 - World.WIDTH * TileWidth) / 2;
		const offsetY = (288 - World.HEIGHT * TileHeight) / 2;

		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.WIDTH; x++) {
				const zone = world.getZone(x, y);
				let tile = this._tileForZone(zone);

				if (tile && tile.image && tile.image)
					renderer.renderImage(tile.image, offsetX + x * TileWidth, offsetY + y * TileHeight);
			}
		}

		if ((this._ticks % (2 * MapScene.LOCATOR_TICKS)) / MapScene.LOCATOR_TICKS < 1) {
			const x = offsetX + TileWidth * state.worldLocation.x;
			const y = offsetY + TileHeight * state.worldLocation.y;
			if (this._location && this._location.image) renderer.renderImage(this._location.image, x, y);
		}
	}

	private _tileForZone(zone: Zone): Tile {
		let tile = this._locatorTile.forZone(zone, zone && zone.visited, Settings.revealWorld);
		if (tile instanceof Array) tile = tile[zone && zone.solved ? 1 : 0];

		return this.engine.data.tiles[tile];
	}
}

export default MapScene;
