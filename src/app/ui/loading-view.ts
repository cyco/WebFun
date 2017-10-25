import { CanvasRenderer, ColorPalette } from "src/engine";
import { ProgressBar } from "src/ui/components";
import "./loading-view.scss";
import Component from "src/ui/component";

class LoadingView extends Component {
	public static readonly TagName = 'wf-loading-view';

	private _imageCanvas: HTMLCanvasElement;
	private _progressBar: ProgressBar;

	constructor() {
		super();

		this._imageCanvas = document.createElement("canvas");
		this._imageCanvas.ondragstart = (event) => {
			event.preventDefault();
			return false;
		};
		this._imageCanvas.width = 288;
		this._imageCanvas.height = 288;
		this._progressBar = new ProgressBar();
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._imageCanvas);
		this.appendChild(this._progressBar);
	}

	get progress() {
		return this._progressBar.value;
	}

	set progress(p) {
		this._progressBar.value = p;
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
}

export default LoadingView;
