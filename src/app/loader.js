import { EventTarget, FileLoader } from '/util';
import Image from '/engine/rendering/image/image';
import { FileReader, GameData } from '/engine';
import Settings from '/settings';

export const Event = {
	Progress: 'progress',
	Fail: 'fail',
	Load: 'load',
};

export default class GameDataLoader extends EventTarget {
	constructor() {
		super();

		this._dataUrl = Settings.url.data;
		this._paletteUrl = Settings.url.palette;

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
		const rawData = FileReader(stream);
		this._engine.gameData = new GameData(rawData);
		this._progress(1, 1);
		this._loadPalette();
	}

	_loadPalette() {
		const loader = new FileLoader(this._paletteUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(2, progress);
		loader.onfail = (reason) => this._fail(reason);
		loader.onload = ({ detail: { arraybuffer } }) => {
			const palette = new Uint8Array(arraybuffer);
			this._engine.palette = palette;
			Image.SetPalette(palette);
			this._loadSetupImage();
		};
		loader.load();
	}

	_loadSetupImage() {
		this._progress(3, 0);
		console.log('_loadSetupImage');
		this._progress(3, 1);

		this._load();
	}

	_fail(reason) {
		this.dispatchEvent(Event.Fail, { reason });
	}

	_progress(state, progress) {
		this.dispatchEvent(Event.Progress, { progress: state / 4.0 + progress / 4.0 });
	}

	_load() {
		this.dispatchEvent(Event.Load);
	}
}
