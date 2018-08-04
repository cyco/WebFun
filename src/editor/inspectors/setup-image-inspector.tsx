import AbstractInspector from "./abstract-inspector";
import { PaletteView } from "../components";
import { Size, downloadImage, rgba } from "src/util";
import { FilePicker } from "src/ui";
import { Button } from "src/ui/components";

class SetupImageInspector extends AbstractInspector {
	private _paletteView: PaletteView = document.createElement(PaletteView.tagName) as PaletteView;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Setup Image";
		this.window.autosaveName = "setup-image-inspector";
		this.window.style.width = "288px";
		this.window.content.style.height = "338px";
		this.window.content.style.flexDirection = "column";

		this._paletteView.size = new Size(288, 288);
		(this._paletteView as any)._canvas.style.width = `${288 + 2}px`;
		(this._paletteView as any)._canvas.style.height = `${288 + 2}px`;

		this.window.content.appendChild(this._paletteView);

		this.window.content.appendChild(
			<div>
				<Button label="Read from file" onclick={() => this.loadImage()} />
				<Button label="Download" onclick={() => this.saveImage()} />
			</div>
		);
	}

	public saveImage() {
		downloadImage(this._paletteView.renderedImage, "setup-image.png", "png");
	}

	public async loadImage() {
		const [imageFile] = await FilePicker.Pick();
		const image = await imageFile.readAsImage();
		document.body.appendChild(image as HTMLImageElement);
		const imageData = image.toImageData();

		const size = imageData.width * imageData.height;
		const paletteImage = new Uint8Array(size);
		const palette = this._paletteView.palette;

		for (let i = 0; i < size; i++) {
			const j = i * 4;
			const [r, g, b, a] = [
				imageData.data[j + 0],
				imageData.data[j + 1],
				imageData.data[j + 2],
				imageData.data[j + 3]
			];

			const color = palette.findColor(r, g, b, a);
			paletteImage[i] = color;
		}

		this._paletteView.image = paletteImage;
		(this.data.currentData as any)._setup = paletteImage;
		this._paletteView.redraw();
	}

	build() {
		this._paletteView.palette = this.data.palette;
		this._paletteView.image = this.data.currentData.setupImageData;

		this._paletteView.redraw();
	}
}

export default SetupImageInspector;
