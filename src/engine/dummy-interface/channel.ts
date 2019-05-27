import { Channel } from "../audio";

class DummyChannel implements Channel<any> {
	public muted: boolean = false;
	public volume: number = 0.0;
	public provider: (id: number) => any;

	playSound(_: any): void {}

	stop(): void {}

	mute(): void {
		this.muted = true;
	}
	unmute(): void {
		this.muted = false;
	}

	isMuted(): boolean {
		return this.muted;
	}
}
export default DummyChannel;
