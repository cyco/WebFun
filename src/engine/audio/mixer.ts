import { Sound } from "src/engine/objects";
import Channel from "./channel";

interface Mixer {
	volume: number;

	play(sound: Sound, channel: Channel): void;
	stop(): void;
}

export default Mixer;
