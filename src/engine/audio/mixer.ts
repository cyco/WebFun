import Channel from "./channel";
import SoundLoader from "./sound-loader";

class Mixer<Sound> {
	readonly loader: SoundLoader<Sound>;
	readonly musicChannel: Channel<Sound>;
	readonly effectChannel: Channel<Sound>;
	protected _volume: number;
	protected _muted: boolean;

	constructor(loader: SoundLoader<Sound>, musicChannel: Channel<Sound>, effectChannel: Channel<Sound>) {
		this.loader = loader;
		this.musicChannel = musicChannel;
		this.effectChannel = effectChannel;
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
