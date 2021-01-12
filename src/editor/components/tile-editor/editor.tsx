import "./editor.scss";

import { AbstractPanel, Button } from "src/ui/components";
import { Size, downloadImage, rgba } from "src/util";

import { ColorPalette } from "src/engine/rendering";
import { FilePicker } from "src/ui";
import { MutableTile } from "src/engine/mutable-objects";
import PaletteColorPicker from "../palette-color-picker";
import PaletteImageEditor from "../palette-image-editor";

class Editor extends AbstractPanel {
	static tagName = "wf-editor-tile-editor";
	public title = "Tile Editor";
	public tile: MutableTile;
	private _imageEditor = (
		<PaletteImageEditor size={new Size(32, 32)} style={{ width: "128px", height: "128px" }} />
	) as PaletteImageEditor;
	private _colorPicker = (
		<PaletteColorPicker
			size={new Size(16, 16)}
			style={{ width: "128px", height: "128px" }}
			onchange={() => (this._imageEditor.colorIndex = this._colorPicker.colorIndex)}
		/>
	) as PaletteColorPicker;

	constructor() {
		super();

		this.content.appendChild(
			<div>
				{this._imageEditor}
				{this._colorPicker}
			</div>
		);
		this.content.appendChild(
			<div>
				<Button label="Read from file" onclick={() => this.loadImageFromFile()} />
				<Button label="Download" onclick={() => this.downloadImage()} />
			</div>
		);
	}

	private downloadImage() {
		const imageName = `Tile ${this.tile.id}.png`;
		downloadImage(this._imageEditor.renderedImage, imageName);
	}

	private async loadImageFromFile() {
		const [imageFile] = await FilePicker.Pick();
		const image = await imageFile.readAsImage();
		document.body.appendChild(image as HTMLImageElement);
		const imageData = image.toImageData();

		const size = imageData.width * imageData.height;
		const pixels = new Uint8Array(size);
		const palette = this._imageEditor.palette;

		for (let i = 0; i < size; i++) {
			const j = i * 4;
			const [r, g, b, a] = [
				imageData.data[j + 0],
				imageData.data[j + 1],
				imageData.data[j + 2],
				imageData.data[j + 3]
			];

			pixels[i] = palette.findColor(r, g, b, a);
		}

		this._imageEditor.image = pixels;
		this.tile.imageData = pixels;
		this._imageEditor.redraw();
	}

	set pixels(p: Uint8Array) {
		this._imageEditor.image = p;
	}

	get pixels(): Uint8Array {
		return this._imageEditor.image;
	}

	set palette(p: ColorPalette) {
		this._imageEditor.palette = p;
		this._colorPicker.palette = p;
		this._colorPicker.color = rgba(0, 0, 0, 0);
	}

	get palette(): ColorPalette {
		return this._colorPicker.palette;
	}
}

export default Editor;
