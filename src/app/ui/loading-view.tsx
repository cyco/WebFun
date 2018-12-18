import { CompressedColorPalette } from "src/engine";
import { SegmentedProgressBar } from "src/ui/components";
import { drawImage } from "src/app/rendering/canvas";
import { Size } from "src/util";
import Component from "src/ui/component";
import "./loading-view.scss";

class LoadingView extends Component {
	public static readonly tagName = "wf-loading-view";
	private _image: Uint8Array;
	private _palette: CompressedColorPalette;

	private _imageCanvas: HTMLCanvasElement = (
		<canvas
			width={288}
			height={288}
			ondragstart={e => {
				e.preventDefault();
				return false;
			}}
		/>
	) as HTMLCanvasElement;
	private _progressBar: SegmentedProgressBar = <SegmentedProgressBar /> as SegmentedProgressBar;

	protected connectedCallback() {
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

	private _redraw() {
		if (!this.palette || !this.image) return;
		const imageData = drawImage(this.image, new Size(288, 288), this.palette);
		const ctx = this._imageCanvas.getContext("2d");
		ctx.clearRect(0, 0, 288, 288);
		ctx.putImageData(imageData, 0, 0);
	}

	set palette(p) {
		this._palette = p;
		this._redraw();
	}

	get palette() {
		return this._palette;
	}

	set image(p) {
		this._image = p;
		this._redraw();
	}
	get image() {
		return this._image;
	}
}

export default LoadingView;
