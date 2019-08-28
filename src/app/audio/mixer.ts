import { Mixer as MixerInterface, Channel } from "src/engine/audio";
import { Sound } from "src/engine/objects";
import { AudioContext } from "src/std/webaudio";
import Settings from "src/settings";

class Mixer implements MixerInterface {
	public muted: boolean;

	private _context: AudioContext;
	private _settings: typeof Settings;
	private _master: GainNode;
	private _effects: GainNode;
	private _music: GainNode;

	constructor(settings: typeof Settings) {
		this._context = new AudioContext();
		this._settings = settings;

		this._master = this._context.createGain();
		this._master.connect(this._context.destination);

		this._effects = this._context.createGain();
		this._effects.connect(this._master);

		this._music = this._context.createGain();
		this._music.connect(this._master);
	}

	public async prepare(sound: Sound, buffer: ArrayBuffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this._context.decodeAudioData(
				buffer,
				b => {
					sound.representation = b;
					resolve();
				},
				reject
			);
		});
	}

	public play(sound: Sound, channel: Channel): void {
		if (!this._settings[this.settingNameForChannel(channel)]) return;

		const buffer = sound.representation as AudioBuffer;
		const source = this.context.createBufferSource();
		source.buffer = buffer;
		source.connect(this.nodeForChannel(channel));
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

	private nodeForChannel(channel: Channel) {
		switch (channel) {
			case Channel.Effect:
				return this._effects;
			case Channel.Music:
				return this._music;
		}
	}

	public stop(): void {}

	public get context() {
		return this._context;
	}

	set volume(v: number) {
		this._master.gain.value = v;
	}

	get volume() {
		return this._master.gain.value;
	}
}

export default Mixer;
