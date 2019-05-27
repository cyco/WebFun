interface Channel<Sound> {
	muted: boolean;
	volume: number;
	provider: (id: number) => Sound;

	playSound(sound: Sound): void;
	stop(): void;

	mute(): void;
	unmute(): void;
	isMuted(): boolean;
}

export default Channel;
