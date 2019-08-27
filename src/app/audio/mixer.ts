import { Mixer as MixerInterface, Channel } from "src/engine/audio";
import { Sound } from "src/engine/objects";
import { AudioContext } from "src/std/webaudio";
import Settings from "src/settings";

class Mixer implements MixerInterface {
	public volume: number;
	public muted: boolean;

	private _context: AudioContext;
	private _settings: typeof Settings;

	constructor(settings: typeof Settings) {
		this._context = new AudioContext();
		this._settings = settings;
	}

	public async prepare(sound: Sound, buffer: ArrayBuffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this._context.decodeAudioData(buffer, b => ((sound.representation = b), resolve()), reject);
		});
	}

	public play(sound: Sound, channel: Channel): void {
		if (!this._settings[this.settingNameForChannel(channel)]) return;

		const buffer = sound.representation as AudioBuffer;
		var source = this.context.createBufferSource();
		source.buffer = buffer;
		source.connect(this.context.destination);
		source.start(0);
	}

	private settingNameForChannel(channel: Channel) {
		switch (channel) {
			case Channel.Effect:
				return "playEffects";
			case Channel.Music:
				return "playMusic";
		}
	}

	public stop(): void {}

	public get context() {
		return this._context;
	}
}

export default Mixer;
