import { ProgressBar, View } from "src/ui";
import { CanvasRenderer, ColorPalette } from "src/engine";
import "./loading-view.scss";

class LoadingView extends View {
	private _imageCanvas: HTMLCanvasElement;
	private _progressBar: ProgressBar;

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

	showImage(pixels: Uint8Array, palette: ColorPalette) {
		const renderer = new CanvasRenderer(this._imageCanvas);
		const imageFactory = renderer.imageFactory;
		imageFactory.palette = palette;
		const image = imageFactory.buildImage(288, 288, pixels);
		const representation = <HTMLImageElement><any>image.representation;
		if (representation.complete) renderer.renderImage(image, 0, 0);
		else representation.onload = () => renderer.renderImage(image, 0, 0);
	}

	get progress() {
		return this._progressBar.value;
	}

	set progress(p) {
		this._progressBar.value = p;
	}
}

export default LoadingView;
