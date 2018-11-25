abstract class Channel<Sound> {
	abstract playSound(sound: Sound): void;
	abstract stop(): void;
	muted: boolean;
	volume: number;
	provider: (id: number) => Sound;

	public mute() {
		this.muted = true;
	}

	public unmute() {
		this.muted = false;
	}

	public isMuted() {
		return this.muted;
	}
}

export default Channel;
