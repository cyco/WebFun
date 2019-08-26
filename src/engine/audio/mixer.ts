import { Sound } from "src/engine/objects";
import Channel from "./channel";

interface Mixer {
	volume: number;
	muted: boolean;

	play(sound: Sound, channel: Channel): void;
	stop(): void;
}

export default Mixer;
