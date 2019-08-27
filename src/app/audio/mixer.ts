import { Mixer as MixerInterface, Channel } from "src/engine/audio";
import { Sound } from "src/engine/objects";
import { InputStream } from "src/util";
import { AudioContext } from "src/std/webaudio";

class Mixer implements MixerInterface {
	public volume: number;
	public muted: boolean;

	private _context: AudioContext;

	constructor() {
		this._context = new AudioContext();
	}

	public async prepare(sound: Sound, data: InputStream): Promise<void> {
		const buffer = (data as any)._arrayBuffer;
		return new Promise((resolve, reject) => {
			this._context.decodeAudioData(buffer, b => ((sound.representation = b), resolve()), reject);
		});
	}

	public play(sound: Sound, channel: Channel): void {
		const buffer = sound.representation as AudioBuffer;
		var source = this.context.createBufferSource();
		source.buffer = buffer;
		source.connect(this.context.destination);
		source.start(0);
	}

	public stop(): void {}

	public get context() {
		return this._context;
	}
}

export default Mixer;
