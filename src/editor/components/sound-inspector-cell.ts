import { Cell, Label } from "src/ui/components";
import "./sound-inspector-cell.scss";
import Settings from "../../settings";

type Sound = {
	id: number
	file: string
}

class SoundInspectorCell extends Cell<Sound> {
	public static readonly TagName: string = "wf-sound-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	private _id: HTMLElement;
	private _file: HTMLElement;
	private _play: HTMLElement;
	private _playButton: HTMLElement;
	private _sound: HTMLAudioElement;
	private _playing: boolean = false;

	constructor() {
		super();

		this._id = document.createElement("span");
		this._id.classList.add("id");

		this._file = document.createElement(Label.TagName);
		this._file.onchange = () => {
			this.data.file = this._file.textContent;
			if (!this._sound) return;

			this._sound.pause();
			this._sound = null;
			this._playing = false;
			this._playButton.classList.remove("fa-spinner-circle");
			this._playButton.classList.remove("fa-pause-circle");
			this._playButton.classList.add("fa-play-circle");
		};
		this._file.classList.add("file");

		this._play = document.createElement("span");
		this._play.classList.add("play");
		this._playButton = document.createElement("i");
		this._playButton.classList.add("fa");
		this._playButton.classList.add("fa-play-circle");
		this._playButton.onclick = () => this.togglePlaying();
		this._play.appendChild(this._playButton);
	}

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this.appendChild(this._id);

		this._file.textContent = `${this.data.file}`;
		this.appendChild(this._file);

		this.appendChild(this._play);
	}

	public togglePlaying() {
		if (!this._sound) {
			const url = Settings.url.sfx(this.data.file);
			this._sound = new Audio(url);
			this._sound.autoplay = true;
			this._playButton.classList.remove("fa-play-circle");
			this._playButton.classList.remove("fa-pause-circle");
			this._playButton.classList.add("fa-spinner");
			this._sound.onplay = () => {
				this._playing = true;
				this._playButton.classList.remove("fa-play-circle");
				this._playButton.classList.remove("fa-spinner");
				this._playButton.classList.add("fa-pause-circle");
			};
			this._sound.onended = () => {
				this._playing = false;
				this._playButton.classList.add("fa-play-circle");
				this._playButton.classList.remove("fa-pause-circle");
			};

			return;
		}

		if (this._sound.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) return;

		if (this._playing) {
			this._sound.pause();
		} else {
			this._sound.currentTime = 0;
			this._playing = true;
			this._sound.play();
			this._playButton.classList.add("fa-pause-circle");
		}
	}
}

export default SoundInspectorCell;
