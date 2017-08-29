import { ProgressBar, View } from "/ui";
import { CanvasRenderer } from "/engine";
import "./loading-view.scss";

export default class extends View {
	constructor() {
		super();

		this.element.classList.add("loading-view");

		this._imageCanvas = document.createElement("canvas");
		this._imageCanvas.ondragstart = (event) => {
			event.preventDefault();
			return false;
		};
		this._imageCanvas.width = 288;
		this._imageCanvas.height = 288;
		this.element.appendChild(this._imageCanvas);

		this._progressBar = new ProgressBar();
		this.element.appendChild(this._progressBar.element);
	}

	showImage(pixels, palette) {
		const renderer = new CanvasRenderer(this._imageCanvas);
		const imageFactory = renderer.imageFactory;
		imageFactory.palette = palette;
		const image = imageFactory.buildImage(288, 288, pixels);
		renderer.renderImage(image, 0, 0);
	}

	get progress() {
		return this._progressBar.value;
	}

	set progress(p) {
		this._progressBar.value = p;
	}
}
