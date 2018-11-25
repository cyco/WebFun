import { Channel } from "src/engine/audio";

class DOMAudioChannel extends Channel<HTMLAudioElement> {
	private _sounds: HTMLAudioElement[] = [];
	private _muted = false;
	private _volume = 1.0;
	public provider: (id: number) => HTMLAudioElement;

	playSound(sound: HTMLAudioElement): void {
		sound = sound.cloneNode(true) as HTMLAudioElement;
		sound.muted = this.muted;
		sound.volume = this.volume;
		sound.onended = () => this._sounds.splice(this._sounds.indexOf(sound), 1);
		this._sounds.push(sound);
		sound.play();
	}

	stop(): void {
		this._sounds.forEach(s => s.pause());
		this._sounds = [];
	}

	set volume(v: number) {
		this._sounds.forEach(s => (s.volume = v));
		this._volume = v;
	}

	get volume() {
		return this._volume;
	}

	set muted(m: boolean) {
		this._sounds.forEach(s => (s.muted = m));
		this._muted = m;
	}

	get muted() {
		return this._muted;
	}
}

export default DOMAudioChannel;
