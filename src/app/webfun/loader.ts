import { EventTarget } from "src/util";
import { GameData, readGameDataFileProgressively, ResourceManager, Variant } from "src/engine";

import { ColorPalette } from "src/engine/rendering";
import { Mixer } from "./audio";
import LoaderEvent from "./loader-event";
import { Sound } from "src/engine/objects";

export const Events = {
	Progress: "progress",
	Fail: "fail",
	Load: "load",
	DidLoadPalette: "loadpalette",
	DidLoadSetupImage: "loadsetupimage"
};

export const StageCount = 4;

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
	private _variant: Variant;

	constructor(resources: ResourceManager, mixer: Mixer, variant: Variant) {
		super();

		this._resources = resources;
		this._mixer = mixer;
		this._variant = variant;

		this.registerEvents(Events);
	}

	public async load(): Promise<void> {
		try {
			await this.loadPalette();
			await this.loadGameData();
			await this.readGameData();
			await this.loadSounds();

			this.dispatchEvent(Events.Load, {
				palette: this._palette,
				data: this._data
			});
		} catch (error) {
			this.dispatchEvent(Events.Fail, {
				reason: error
			});
		}
	}

	private async loadPalette(): Promise<void> {
		this._progress(0, 0);
		this._palette = await this._resources.loadPalette(p => this._progress(0, p));
		this._progress(0, 1);
	}

	private async loadGameData(): Promise<void> {
		this._progress(1, 0);

		return new Promise(async (resolve, reject) => {
			const stream = await this._resources.loadGameFile(p => this._progress(1, p));
			const reader = readGameDataFileProgressively(stream, this._variant);
			stream.onprogress = () => {
				this._progress(1, stream.bytesAvailable / stream.bytesTotal);
				const { done, value: data } = reader.next();
				if (done) return;
				if (!data) return;
				if (!data.setup) return;

				stream.onprogress = () => this._progress(1, stream.bytesAvailable / stream.bytesTotal);

				this.dispatchEvent(Events.DidLoadSetupImage, {
					pixels: data.setup,
					palette: this._palette
				});
			};
			stream.onerror = () => {
				stream.onprogress = null;
				stream.onload = null;
				reject(stream.error);
			};
			stream.onload = () => {
				do {
					const { value, done } = reader.next();
					if (value) this._rawData = value;
					if (done) break;
				} while (true);

				this._progress(1, 1);

				stream.onprogress = null;
				stream.onload = null;

				resolve();
			};
		});
	}

	private readGameData(): Promise<void> {
		this._progress(2, 0);
		this._data = new GameData(this._rawData);
		this._progress(2, 1);

		return Promise.resolve();
	}

	private async loadSounds() {
		this._progress(3, 0);

		let totalProgress = 0;
		const soundBufferRequests: [Sound, Promise<ArrayBuffer>][] = this._data.sounds
			.filter(snd => snd.file)
			.map(snd => [
				snd,
				this._resources.loadSound(snd.file, n => {
					totalProgress += n;
					this._progress(3, totalProgress / soundBufferRequests.length);
				})
			]);

		for (const [sound, request] of soundBufferRequests) {
			await this._mixer.prepare(sound, await request);
		}
		this._progress(3, 1);
	}

	private _progress(state: number, progress: number) {
		this.dispatchEvent(Events.Progress, {
			progress: (state + progress) / StageCount
		});
	}
}

export default Loader;
