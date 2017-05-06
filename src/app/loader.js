import { EventTarget, FileLoader, dispatch } from "/util";
import { FileReader, GameData } from "/engine";
import { Tile } from '/engine/objects';
import Settings from "/settings";

export const Event = {
	Progress: "progress",
	Fail: "fail",
	Load: "load",
	DidLoadSetupImage: "loadsetupimage"
};

export const StageCount = 10;
const TileImageBatchSize = 100;
export default class GameDataLoader extends EventTarget {
	constructor() {
		super();

		this._dataUrl = Settings.url.data;
		this._paletteUrl = Settings.url.palette;
		this._rawData = null;

		this._engine = null;

		this.registerEvents(Event);
	}

	load(engine) {
		this._engine = engine;

		const loader = new FileLoader(this._dataUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(0, progress);
		loader.onfail = (reason) => this._fail(reason);
		loader.onload = ({ detail: { stream } }) => this._readGameData(stream);
		loader.load();
	}

	_readGameData(stream) {
		this._progress(1, 0);
		this._rawData = FileReader(stream);
		this._progress(1, 1);
		this._loadPalette();
	}

	_loadPalette() {
		const loader = new FileLoader(this._paletteUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(2, progress);
		loader.onfail = (reason) => this._fail(reason);
		loader.onload = ({ detail: { arraybuffer } }) => {
			const palette = new Uint8Array(arraybuffer);
			this._engine.imageFactory.palette = palette;
			this._loadSetupImage();
		};
		loader.load();
	}

	_loadSetupImage() {
		this._progress(3, 0);
		const pixelData = this._rawData.STUP.pixelData;
		const setupImage = this._engine.imageFactory.buildImage(288, 288, pixelData);
		this.dispatchEvent(Event.DidLoadSetupImage, {
			setupImage
		});
		this._progress(3, 1);
		this._loadGameData();
	}

	_loadGameData() {
		this._progress(4, 0);
		this._engine.data = new GameData(this._rawData);
		this._progress(4, 1);

		this._loadTileImages();
	}

	_loadTileImages() {
		this._progress(5, 0);
		const engine = this._engine;
		const tiles = engine.data.tiles;
		const imageFactory = engine.imageFactory;
		const tileHeight = Tile.HEIGHT;
		const tileWidth = Tile.WIDTH;
		const tileCount = tiles.length;

		const loadBatch = (idx) => {
			const max = Math.min(idx + TileImageBatchSize, tileCount);
			for (; idx < max; idx++) {
				const tile = tiles[idx];
				tile._image = imageFactory.buildImage(tileWidth, tileHeight, tile._imageData);
				if(tile.image && tile.name) tile.image.representation.title = tile.name;
				tile._imageData = null;
				this._progress(5, 4 * (idx / tileCount));
			}
		};

		const loadTileImage = (idx) => {
			if (idx >= tileCount) {
				this._progress(9, 1);
				this._load();
				return;
			}

			loadBatch(idx);

			dispatch(() => loadTileImage(idx + TileImageBatchSize));
		};

		loadTileImage(0);
	}

	_fail(reason) {
		this.dispatchEvent(Event.Fail, {
			reason
		});

		this._clearData();
	}

	_progress(state, progress) {
		this.dispatchEvent(Event.Progress, {
			progress: (state + progress) / StageCount
		});
	}

	_load() {
		this.dispatchEvent(Event.Load);
		this._clearData();
	}

	_clearData() {
		this._rawData = null;
		this._setupImage = null;
	}

	get setupImage() {
		return this._setupImage;
	}
}
