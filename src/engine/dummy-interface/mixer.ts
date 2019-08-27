import { Sound } from "src/engine/objects";
import { Mixer, Channel } from "src/engine/audio";

class DummyMixer implements Mixer {
	volume: number = 1.0;

	play(_sound: Sound, _channel: Channel): void {}

	stop(): void {}
}

export default DummyMixer;
