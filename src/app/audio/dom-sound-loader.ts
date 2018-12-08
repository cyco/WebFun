import { SoundLoader } from "src/engine/audio";

class DOMSoundLoader extends SoundLoader<HTMLAudioElement> {
	private readonly baseURL: string;
	constructor(url: string) {
		super();
		this.baseURL = url;
	}

	loadSound(file: string) {
		return new Promise<HTMLAudioElement>((resolve, reject) => {
			const url = this.baseURL + encodeURIComponent(file + ".mp3");
			const audio = new Audio(url);
			audio.load();
			if (audio.readyState === 4) {
				resolve(audio);
			} else {
				audio.addEventListener("loadeddata", () => resolve(audio));
				audio.addEventListener("error", reject);
			}
		});
	}
}

export default DOMSoundLoader;