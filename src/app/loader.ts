import { EventTarget, InputStream } from "src/util";
import { GameData, GameTypeYoda, readGameDataFile } from "src/engine";

import { ColorPalette } from "src/engine/rendering";
import { ResourceManager } from "src/engine";
import { Mixer } from "./audio";
import LoaderEvent from "./loader-event";

export const Events = {
	Progress: "progress",
	Fail: "fail",
	Load: "load",
	DidLoadPalette: "loadpalette",
	DidLoadSetupImage: "loadsetupimage"
};

export const StageCount = 9;

class Loader extends EventTarget {
	public onfail: (_: LoaderEvent) => void;
	public onprogress: (_: LoaderEvent) => void;
	public onloadpalette: (_: LoaderEvent) => void;
	public onloadsetupimage: (_: LoaderEvent) => void;
	public onload: (_: LoaderEvent) => void;
	private _rawData: any;
	private _data: GameData;
	private _palette: ColorPalette;
	private _resources: ResourceManager;
	private _mixer: Mixer;

	constructor(resources: ResourceManager, mixer: Mixer) {
		super();
		this._resources = resources;
		this._mixer = mixer;

		this.registerEvents(Events);
	}

	public load() {
		this._resources
			.loadGameFile(progress => this._progress(0, progress))
			.then(s => this._readGameData(s))
			.catch(e => this._fail(e));
	}

	private _readGameData(stream: InputStream) {
		this._progress(1, 0);
		this._rawData = readGameDataFile(stream, GameTypeYoda);
		this._progress(1, 1);
		this._loadPalette();
	}

	private _loadPalette() {
		this._resources
			.loadPalette(progress => this._progress(2, progress))
			.then(palette => {
				this._palette = palette;
				this.dispatchEvent(Events.DidLoadPalette, {
					palette
				});
				this._loadSetupImage(palette);
			})
			.catch(e => this._fail(e));
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
		this._progress(5, 0);
		for (const sound of this._data.sounds) {
			if (!sound.file) continue;

			const buffer = await this._resources.loadSound(sound.file, () => void 0);
			await this._mixer.prepare(sound, buffer);
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
