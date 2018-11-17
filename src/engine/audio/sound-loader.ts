abstract class SoundLoader<Sound> {
	abstract async loadSound(sound: string): Promise<Sound>;
}

export default SoundLoader;
