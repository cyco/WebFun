import Channel from "./channel";

class Mixer<Sound> {
	readonly provider: (id: number) => Sound;
	readonly musicChannel: Channel<Sound>;
	readonly effectChannel: Channel<Sound>;
	protected _volume: number = 1;
	protected _muted: boolean = false;

	constructor(
		provider: (id: number) => Sound,
		musicChannel: Channel<Sound>,
		effectChannel: Channel<Sound>
	) {
		this.provider = provider;
		this.musicChannel = musicChannel;
		this.musicChannel.provider = provider;
		this.effectChannel = effectChannel;
		this.effectChannel.provider = provider;
	}

	public set volume(v: number) {
		this.musicChannel.volume = v;
		this.effectChannel.volume = v;
		this._volume = v;
	}

	public get volume() {
		return this._volume;
	}

	public set muted(flag: boolean) {
		this.musicChannel.muted = flag;
		this.effectChannel.muted = flag;
		this._muted = flag;
	}

	public get muted() {
		return this._muted;
	}

	public mute() {
		this.muted = true;
	}

	public unmute() {
		this.muted = false;
	}

	public get isMuted() {
		return this.muted;
	}
}

export default Mixer;
