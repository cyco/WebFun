import { ColorPalette, DataFileReader, GameData } from "src/engine";
import { Tile } from "src/engine/objects";
import { AbstractImageFactory } from "src/engine/rendering";
import Settings from "src/settings";
import { dispatch, EventTarget, FileLoader, InputStream } from "src/util";

export const Events = {
	Progress: "progress",
	Fail: "fail",
	Load: "load",
	DidLoadSetupImage: "loadsetupimage"
};

export const StageCount = 10;
const TileImageBatchSize = 100;

export declare interface LoaderEventDetails {
	data: GameData;
	palette: ColorPalette;
}

class Loader extends EventTarget {
	public onfail: (_: CustomEvent) => void;
	public onprogress: (_: CustomEvent) => void;
	public onloadsetupimage: (_: CustomEvent) => void;
	public onload: (_: CustomEvent) => void;
	private _dataUrl: string;
	private _paletteUrl: string;
	private _rawData: any;
	private _data: GameData;
	private _palette: Uint8Array;
	private _imageFactory: AbstractImageFactory;

	constructor() {
		super();

		this._dataUrl = Settings.url.data;
		this._paletteUrl = Settings.url.palette;

		this.registerEvents(Events);
	}

	load(factory: AbstractImageFactory) {
		this._imageFactory = factory;

		const loader = new FileLoader(this._dataUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(0, progress);
		loader.onfail = reason => this._fail(reason);
		loader.onload = ({ detail: { kaitaiStream } }) => this._readGameData(kaitaiStream);
		loader.load();
	}

	_readGameData(stream: InputStream) {
		this._progress(1, 0);
		this._rawData = new DataFileReader(stream);
		this._progress(1, 1);
		this._loadPalette();
	}

	_loadPalette() {
		const loader = new FileLoader(this._paletteUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(2, progress);
		loader.onfail = reason => this._fail(reason);
		loader.onload = ({ detail: { arraybuffer } }) => {
			const palette = new Uint8Array(arraybuffer);
			this._imageFactory.palette = palette;
			this._palette = palette;
			this._loadSetupImage(palette);
		};
		loader.load();
	}

	_loadSetupImage(palette: Uint8Array) {
		this._progress(3, 0);

		const setupImageCategory = this._rawData.catalog.find((c: any) => c.type === "STUP");
		if (!setupImageCategory) {
			this._fail("Setup image not found in game file!");
			return;
		}

		const pixels = setupImageCategory.content.pixels;
		this.dispatchEvent(Events.DidLoadSetupImage, {
			pixels,
			palette
		});
		this._progress(3, 1);
		this._loadGameData();
	}

	_loadGameData() {
		this._progress(4, 0);
		this._data = new GameData(this._rawData);
		this._progress(4, 1);

		this._loadTileImages();
	}

	_loadTileImages() {
		this._progress(5, 0);
		const tiles = this._data.tiles;
		const imageFactory = this._imageFactory;
		const tileHeight = Tile.HEIGHT;
		const tileWidth = Tile.WIDTH;
		const tileCount = tiles.length;

		imageFactory.prepare(tileCount);

		const loadBatch = (idx: number) => {
			const max = Math.min(idx + TileImageBatchSize, tileCount);
			for (; idx < max; idx++) {
				const tile = tiles[idx];
				tile.image = imageFactory.buildImage(tileWidth, tileHeight, tile.imageData);
				if (tile.image && tile.name) tile.image.representation.title = tile.name;
				this._progress(5, 4 * (idx / tileCount));
			}
		};

		const loadTileImage = (idx: number) => {
			if (idx >= tileCount) {
				this._imageFactory.finalize();
				this._progress(9, 1);
				this._load();
				return;
			}

			loadBatch(idx);

			dispatch(() => loadTileImage(idx + TileImageBatchSize));
		};

		loadTileImage(0);
	}

	_fail(reason: any) {
		this.dispatchEvent(Events.Fail, {
			reason
		});
	}

	_progress(state: number, progress: number) {
		this.dispatchEvent(Events.Progress, {
			progress: (state + progress) / StageCount
		});
	}

	_load() {
		this.dispatchEvent(Events.Load, <LoaderEventDetails>{ palette: this._palette, data: this._data });
	}
}

export default Loader;
