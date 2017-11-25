import AbstractInspector from "./abstract-inspector";
import { PaletteView } from "../components";
import { Size } from "src/util";

class SetupImageInspector extends AbstractInspector {
	private _paletteView: PaletteView = <PaletteView>document.createElement(PaletteView.TagName);

	constructor(state: Storage) {
		super(state);

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

export default SetupImageInspector;
