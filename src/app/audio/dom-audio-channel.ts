import { Channel } from "src/engine/audio";

class DOMAudioChannel extends Channel<HTMLAudioElement> {
	private _sounds: HTMLAudioElement[] = [];
	private _muted = false;
	private _volume = 1.0;
	public provider: (id: number) => HTMLAudioElement;

	playSound(sound: HTMLAudioElement | number): void {
		let soundNode = sound instanceof HTMLAudioElement ? sound : this.provider(sound);

		soundNode = soundNode.cloneNode(true) as HTMLAudioElement;
		soundNode.muted = this.muted;
		soundNode.volume = this.volume;
		soundNode.onended = () => this._sounds.splice(this._sounds.indexOf(soundNode), 1);
		this._sounds.push(soundNode);
		soundNode.play();
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
