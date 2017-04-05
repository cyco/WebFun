import { EventTarget, FileLoader } from "/util";
import { FileReader, GameData } from "/engine";
import Settings from "/settings";

export const Event = {
	Progress: "progress",
	Fail: "fail",
	Load: "load",
	DidLoadSetupImage: "loadsetupimage"
};

const StageCount = 5;
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
		loader.onprogress = ({detail: {progress}}) => this._progress(0, progress);
		loader.onfail = (reason) => this._fail(reason);
		loader.onload = ({detail: {stream}}) => this._readGameData(stream);
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
		loader.onprogress = ({detail: {progress}}) => this._progress(2, progress);
		loader.onfail = (reason) => this._fail(reason);
		loader.onload = ({detail: {arraybuffer}}) => {
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
		this._load();
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
