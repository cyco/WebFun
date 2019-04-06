import { PaletteColorPicker, PaletteImageEditor } from "../components";
import { Size, downloadImage } from "src/util";

import AbstractInspector from "./abstract-inspector";
import { Button } from "src/ui/components";
import { FilePicker } from "src/ui";

class SetupImageInspector extends AbstractInspector {
	private _imageEditor = (
		<PaletteImageEditor
			size={new Size(288, 288)}
			style={{ width: "230px", height: "230px", display: "inline-block" }}
		/>
	) as PaletteImageEditor;
	private _colorPicker = (
		<PaletteColorPicker
			size={new Size(16, 16)}
			style={{
				width: "128px",
				height: "128px",
				"margin-left": "20px",
				display: "inline-block"
			}}
			onchange={() => (this._imageEditor.colorIndex = this._colorPicker.colorIndex)}
		/>
	) as PaletteColorPicker;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Setup Image";
		this.window.autosaveName = "setup-image-inspector";
		this.window.style.width = "380px";
		this.window.content.style.height = "270px";
		this.window.content.style.flexDirection = "column";

		this.window.content.appendChild(
			<div>
				{this._imageEditor}
				{this._colorPicker}
			</div>
		);

		this.window.content.appendChild(
			<div>
				<Button label="Read from file" onclick={() => this.loadImage()} />
				<Button label="Download" onclick={() => this.saveImage()} />
			</div>
		);
	}

	public saveImage() {
		downloadImage(this._imageEditor.renderedImage, "setup-image.png", "png");
	}

	public async loadImage() {
		const [imageFile] = await FilePicker.Pick();
		const image = await imageFile.readAsImage();
		document.body.appendChild(image as HTMLImageElement);
		const imageData = image.toImageData();

		const size = imageData.width * imageData.height;
		const paletteImage = new Uint8Array(size);
		const palette = this._imageEditor.palette;

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

		this._imageEditor.image = paletteImage;
		(this.data.currentData as any)._setup = paletteImage;
		this._imageEditor.redraw();
	}

	build() {
		this._colorPicker.palette = this.data.palette;
		this._imageEditor.palette = this.data.palette;
		this._imageEditor.image = this.data.currentData.setupImageData;

		this._imageEditor.redraw();
	}
}

export default SetupImageInspector;
