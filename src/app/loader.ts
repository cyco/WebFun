import { EventTarget, FileLoader, InputStream } from "src/util";
import { GameData, GameTypeYoda, readGameDataFile } from "src/engine";

import { ColorPalette } from "src/engine/rendering";
import { DOMSoundLoader } from "./audio";
import Settings from "src/settings";
import { Loader as LoaderInterface } from "src/engine";

export const Events = {
	Progress: "progress",
	Fail: "fail",
	Load: "load",
	DidLoadSetupImage: "loadsetupimage"
};

export const StageCount = 9;

class Loader extends EventTarget implements LoaderInterface {
	public onfail: (_: CustomEvent) => void;
	public onprogress: (_: CustomEvent) => void;
	public onloadsetupimage: (_: CustomEvent) => void;
	public onload: (_: CustomEvent) => void;
	private _dataUrl: string;
	private _paletteUrl: string;
	private _rawData: any;
	private _buildSoundUrl: (name: string) => string;
	private _data: GameData;
	private _palette: ColorPalette;

	constructor() {
		super();

		this._dataUrl = Settings.url.yoda.data;
		this._paletteUrl = Settings.url.yoda.palette;
		this._buildSoundUrl = Settings.url.yoda.sfx;

		this.registerEvents(Events);
	}

	public load() {
		const loader = new FileLoader(this._dataUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(0, progress);
		loader.onfail = reason => this._fail(reason);
		loader.onload = ({ detail: { stream } }) => this._readGameData(stream);
		loader.load();
	}

	private _readGameData(stream: InputStream) {
		this._progress(1, 0);
		this._rawData = readGameDataFile(stream, GameTypeYoda);
		this._progress(1, 1);
		this._loadPalette();
	}

	private _loadPalette() {
		const loader = new FileLoader(this._paletteUrl);
		loader.onprogress = ({ detail: { progress } }) => this._progress(2, progress);
		loader.onfail = reason => this._fail(reason);
		loader.onload = ({ detail: { arraybuffer } }) => {
			const palette = Uint32Array.paletteFromArrayBuffer(arraybuffer);
			this._palette = palette;
			this._loadSetupImage(palette);
		};
		loader.load();
	}

	private _loadSetupImage(palette: ColorPalette) {
		this._progress(3, 0);

		const pixels = this._rawData.setup;
		if (!pixels) {
			this._fail("Setup image not found in game file!");
			return;
		}

		this.dispatchEvent(Events.DidLoadSetupImage, {
			pixels,
			palette
		});
		this._progress(3, 1);
		this._loadGameData();
	}

	private _loadGameData() {
		this._progress(4, 0);
		this._data = new GameData(this._rawData);
		this._progress(4, 1);

		this._loadSounds();
	}

	private async _loadSounds() {
		if (true) {
			this._finishLoading();
			return;
		}
		this._progress(10, 0);

		const loader = new DOMSoundLoader(this._buildSoundUrl(""));
		let i = 0;
		const count = this._data.sounds.length;
		for (const sound of this._data.sounds) {
			try {
				sound.representation = await loader.loadSound(sound.file);
				i++;
				this._progress(10, i / count);
			} catch (e) {
				console.warn("Unable to load sound", i, e);
			}
		}
		this._finishLoading();
	}

	private _fail(reason: any) {
		this.dispatchEvent(Events.Fail, {
			reason
		});
	}

	private _progress(state: number, progress: number) {
		this.dispatchEvent(Events.Progress, {
			progress: (state + progress) / StageCount
		});
	}

	private _finishLoading() {
		this.dispatchEvent(Events.Load, {
			palette: this._palette,
			data: this._data
		});
	}
}

export default Loader;
