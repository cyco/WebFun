import AbstractInspector from "./abstract-inspector";
import { ColorPicker, PaletteView } from "../components";
import Size from "src/util/size";

class PaletteInspector extends AbstractInspector {
	private _paletteView: PaletteView = <PaletteView>document.createElement(PaletteView.TagName);
	private _colorPicker: ColorPicker = <ColorPicker>document.createElement(ColorPicker.TagName);

	constructor() {
		super();

		this.window.title = "Palette";
		this.window.autosaveName = "palette-inspector";
		this.window.style.width = "278px";
		this.window.content.style.height = "148px";
		this.window.content.style.flexDirection = "row";

		this._paletteView.size = new Size(16, 16);
		this._paletteView.style.width = "128px";
		this._paletteView.style.height = "128px";
		this.window.content.appendChild(this._paletteView);

		this._colorPicker.style.width = "128px";
		this._colorPicker.style.height = "128px";
		this._colorPicker.style.marginLeft = "12px";
		this.window.content.appendChild(this._colorPicker);
	}

	build() {
		this._paletteView.palette = this.data.palette;
		this._paletteView.image = this._fullPaletteImage();

		this._paletteView.redraw();
	}

	private _fullPaletteImage(): Uint8Array {
		const imageData = new Uint8Array(16 * 16);

		for (let i = 0; i < 256; i++) {
			imageData[i] = i;
		}

		return imageData;
	}
}

export default PaletteInspector;
