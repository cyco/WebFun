import { View, ProgressBar } from "/ui";
import "./loading-view.scss";

export default class extends View {
	constructor() {
		super();

		this.element.classList.add("loading-view");

		this._backgroundImage = new View(document.createElement("img"));
		this._backgroundImage.element.ondragstart = (event) => {
			event.preventDefault();
			return false;
		};
		this.element.appendChild(this._backgroundImage.element);

		this._progressBar = new ProgressBar();
		this.element.appendChild(this._progressBar.element);
	}

	set backgroundImageSource(src) {
		this._backgroundImage.element.src = src;
		this._backgroundImage.element.classList.add("fadeIn");
	}

	get backgroundImageSource() {
		return this._backgroundImage.element.src;
	}

	set progress(p) {
		this._progressBar.value = p;
	}

	get progress() {
		return this._progressBar.value;
	}
}
