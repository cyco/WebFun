import { PaletteColorPicker, PaletteImageEditor } from "../components";
import { Size, downloadImage } from "src/util";

import AbstractInspector from "./abstract-inspector";
import { Button } from "src/ui/components";
import { FilePicker } from "src/ui";
import { ColorPalette } from "src/engine";
import ServiceContainer from "../service-container";
import { StartupImage } from "src/engine/objects";

class StartupImageInspector extends AbstractInspector {
	private _imageEditor = (
		<PaletteImageEditor
			size={new Size(288, 288)}
			style={{ width: "288px", height: "288px", display: "inline-block" }}
		/>
	) as PaletteImageEditor;
	private _colorPicker = (
		<PaletteColorPicker
			size={new Size(16, 16)}
			style={{
				"width": "128px",
				"height": "128px",
				"margin-left": "20px",
				"display": "inline-block"
			}}
			onchange={() => (this._imageEditor.colorIndex = this._colorPicker.colorIndex)}
		/>
	) as PaletteColorPicker;

	constructor(state: Storage, di: ServiceContainer) {
		super(state, di);

		this.window.title = "Startup Image";
		this.window.autosaveName = "startup-image-inspector";
		this.window.style.width = "438px";
		this.window.content.style.height = "331px";
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

	public saveImage(): void {
		downloadImage(this._imageEditor.renderedImage, "startup-image.png", "png");
	}

	public async loadImage(): Promise<void> {
		const [imageFile] = await FilePicker.Pick();
		const image = await imageFile.readAsImage();
		document.body.appendChild(image as HTMLImageElement);
		const imageData = image.toImageData();

		const size = imageData.width * imageData.height;
		const paletteImage = new Uint8Array(size);
		const palette = this._imageEditor.palette;

		const memo = new Map<number, number>();
		for (let i = 0; i < size; i++) {
			const j = i * 4;
			const [r, g, b, a] = [
				imageData.data[j + 0],
				imageData.data[j + 1],
				imageData.data[j + 2],
				imageData.data[j + 3]
			];
			paletteImage[i] = this.findColor(palette, r, g, b, a, memo);
		}

		this._imageEditor.image = paletteImage;
		(this.data.currentData as any)._startup = paletteImage;
		this._imageEditor.redraw();
	}

	private findColor(
		palette: ColorPalette,
		r: number,
		g: number,
		b: number,
		a: number,
		memo: Map<number, number>
	): number {
		const color = (r << 24) | (g << 16) | (b << 8) | a;
		if (memo.has(color)) return memo.get(color);

		const mappedColor =
			a < 64
				? 0
				: palette
						.mapArray((c, i) => [
							(r - ((c >> 0) & 0xff)) ** 2 +
								(g - ((c >> 8) & 0xff)) ** 2 +
								(b - ((c >> 16) & 0xff)) ** 2,
							i
						])
						.slice(1)
						.sort((a, b) => a[0] - b[0])
						.first()[1];

		memo.set(color, mappedColor);
		return mappedColor;
	}

	build(): void {
		this._colorPicker.palette = this.data.palette;
		this._imageEditor.palette = this.data.palette;
		this._imageEditor.image = this.data.currentData.get(Uint8Array, StartupImage);

		this._imageEditor.redraw();
	}
}

export default StartupImageInspector;
