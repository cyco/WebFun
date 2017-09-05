import Scene from "./scene";
import { Tile, ZoneType } from "src/engine/objects";
import { World } from "src/engine/generation";
import { LocatorTile, Planet } from "src/engine/types";
import { CheatCodeInput, Invincibility, UnlimitedAmmo, Weapons } from "src/engine/cheats";
import SpeechScene from "./speech-scene";
import { Size } from "src/util";
import Settings from "src/settings";

const TileWidth = 28;
const TileHeight = 28;

export default class MapScene extends Scene {
	static get LOCATOR_TICKS() {
		return 10;
	}

	constructor() {
		super();

		this.engine = null;
		this._ticks = 0;
		this._location = null;

		const cheats = [
			new Weapons(),
			new UnlimitedAmmo(),
			new Invincibility()
		];
		this._cheatInput = new CheatCodeInput(cheats);

		Object.seal(this);
	}

	isOpaque() {
		return true;
	}

	willShow() {
		this._cheatInput.reset();

		this._ticks = 4;

		const self = this;
		this._location = this.engine.data.tiles[ 0x345 ];
		this.engine.inputManager.mouseDownHandler = (p) => self.mouseDown(p);
		this.engine.inputManager.keyDownHandler = (e) => {
			self._cheatInput.addCharacter(String.fromCharCode(e.keyCode).toLowerCase());
		};
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = null;
		this.engine.inputManager.keyDownHandler = null;
	}

	update(/*ticks*/) {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		if (!inputManager.locator) {
			engine.sceneManager.popScene();
		}

		let cheatMessages = this._cheatInput.execute(engine);
		if (cheatMessages.length) {
			this._cheatInput.reset();
			this._showText(cheatMessages.first(), this.engine.state.worldLocation);
		}

		this._ticks++;
	}

	_showText(text, location) {
		const speechScene = new SpeechScene(this.engine);
		speechScene.text = text;
		speechScene.location = location;
		speechScene.tileSize = new Size(Tile.WIDTH, Tile.HEIGHT);

		this.engine.sceneManager.pushScene(speechScene);
	}

	mouseDown(p) {
		const viewWidth = 288,
			viewHeight = 288;

		const worldWidth = World.WIDTH,
			worldHeight = World.HEIGHT;
		const worldHeightPx = worldHeight * Tile.HEIGHT;
		const worldWidthPx = worldWidth * Tile.WIDTH;

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

		let message = zone.getLocatorDescription();
		// TODO: push speech zone
		console.log(message);
	}

	_exitScene() {
		this.engine.sceneManager.popScene();
	}

	render(renderer) {
		renderer.clear();

		const engine = this.engine;
		const state = engine.state;
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
					renderer.renderImage(tile.image,
						offsetX + x * TileWidth, offsetY + y * TileHeight);
			}
		}

		if (this._ticks % (2 * MapScene.LOCATOR_TICKS) / MapScene.LOCATOR_TICKS < 1) {
			const x = offsetX + TileWidth * state.worldLocation.x;
			const y = offsetY + TileHeight * state.worldLocation.y;
			if (this._location && this._location.image)
				renderer.renderImage(this._location.image, x, y);
		}
	}

	_tileForZone(zone) {
		let tile = LocatorTile.ForZone(zone);
		if (tile instanceof Array)
			tile = tile[ zone.solved ? 1 : 0 ];

		return this.engine.data.tiles[ tile ];
	}
}
