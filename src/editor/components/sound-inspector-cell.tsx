import "./sound-inspector-cell.scss";

import Settings from "../../settings";
import { Cell, Label } from "src/ui/components";
import { encodeURIComponent } from "src/std";

interface Sound {
	id: number;
	file: string;
}

class SoundInspectorCell extends Cell<Sound> {
	public static readonly tagName = "wf-sound-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public onchange: (_: Event) => void = () => void 0;
	public onrevealreferences: (_: Event) => void = () => void 0;
	public onremove: (_: Event) => void = () => void 0;

	private _id: HTMLElement;
	private _file: HTMLElement;
	private _play: HTMLElement;
	private _playButton: HTMLElement;
	private _revealButton: HTMLElement;
	private _removeButton: HTMLElement;
	private _sound: HTMLAudioElement;
	private _playing: boolean = false;

	constructor() {
		super();

		this._id = <span className="id" />;
		this._file = (
			<Label
				className="file"
				onchange={(_: CustomEvent) =>
					this.onchange(
						new CustomEvent("change", {
							detail: { sound: this.data, cell: this, label: this._file.textContent },
							bubbles: true
						})
					)
				}
			/>
		);
		this._play = <span className="play" />;
		this._playButton = <i className="fa fa-play-circle" onclick={() => this.togglePlaying()} />;
		this._play.appendChild(this._playButton);

		this._revealButton = (
			<i
				className="fa fa-search"
				onclick={() =>
					this.onrevealreferences(
						new CustomEvent("RevealReferences", {
							detail: { sound: this.data, cell: this },
							bubbles: true
						})
					)
				}
			/>
		);
		this._play.appendChild(this._revealButton);

		this._removeButton = (
			<i
				className="fa fa-remove"
				onclick={() =>
					this.onremove(
						new CustomEvent("Remove", {
							detail: { sound: this.data, cell: this },
							bubbles: true
						})
					)
				}
			/>
		);
		this._play.appendChild(this._removeButton);
	}

	public cloneNode(deep: boolean): SoundInspectorCell {
		const result = super.cloneNode(deep) as SoundInspectorCell;
		result.onchange = this.onchange;
		result.onrevealreferences = this.onrevealreferences;
		result.onremove = this.onremove;
		return result;
	}

	protected connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this.appendChild(this._id);

		this._file.textContent = `${this.data.file}`;
		this.appendChild(this._file);

		this.appendChild(this._play);
	}

	public togglePlaying() {
		if (!this._sound) {
			const url = [Settings.url.yoda.sfx, encodeURIComponent(this.data.file)].join("/");
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

	get label() {
		return this._file.textContent;
	}
}

export default SoundInspectorCell;
