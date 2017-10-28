import AbstractInspector from "./abstract-inspector";
import { ColorPicker, PaletteView } from "../components";
import Size from "src/util/size";

class PaletteInspector extends AbstractInspector {
	private _paletteView: PaletteView = <PaletteView>document.createElement(PaletteView.TagName);
	private _colorPicker: ColorPicker = <ColorPicker>document.createElement(ColorPicker.TagName);

	constructor() {
		super();

		this.window.title = "Setup Image";
		this.window.autosaveName = "setup-image-inspector";
		this.window.style.width = "308px";
		this.window.content.style.height = "308px";
		this.window.content.style.flexDirection = "row";

		this._paletteView.size = new Size(288, 288);
		this._paletteView.style.width = "288px";
		this._paletteView.style.height = "288px";
		this.window.content.appendChild(this._paletteView);
	}

	build() {
		this._paletteView.palette = this.data.palette;
		this._paletteView.image = this.data.currentData.setupImageData;

		this._paletteView.redraw();
	}
}

export default PaletteInspector;
