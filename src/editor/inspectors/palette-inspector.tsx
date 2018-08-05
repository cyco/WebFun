import AbstractInspector from "./abstract-inspector";
import { ColorPicker, PaletteColorPicker } from "../components";
import { IconButton } from "src/ui/components";
import { Color, Size, download, rgba } from "src/util";

class PaletteInspector extends AbstractInspector {
	private _paletteView: PaletteColorPicker = document.createElement(
		PaletteColorPicker.tagName
	) as PaletteColorPicker;
	private _colorPicker: ColorPicker = document.createElement(ColorPicker.tagName) as ColorPicker;
	private _download: IconButton = document.createElement(IconButton.tagName) as IconButton;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Palette";
		this.window.autosaveName = "palette-inspector";
		this.window.style.width = "398px";
		this.window.content.style.height = "204px";
		this.window.content.style.flexDirection = "row";

		this._paletteView.size = new Size(16, 16);
		this._paletteView.style.width = "194px";
		this._paletteView.style.height = "194px";
		this._paletteView.onchange = (_: MouseEvent) =>
			this.editColor(this._paletteView.color as Color);
		this.window.content.appendChild(this._paletteView);

		this._colorPicker.style.height = "184px";
		this._colorPicker.style.minWidth = "182px";
		this._colorPicker.style.marginLeft = "12px";
		this._colorPicker.style.marginTop = "10px";
		this._colorPicker.color = state.load("color") || rgba(0, 0, 0, 0);
		this._colorPicker.onchange = () =>
			this._paletteView.updateCurrentColor(this._colorPicker.color);
		this.window.content.appendChild(this._colorPicker);

		this._download.icon = "download";
		this._download.onclick = () =>
			download(this._paletteView.palette.toGIMP("Yoda Stories"), "Yoda Stories.gpl");
		(this.window as any)._titlebar.addButton(this._download);
	}

	private editColor(color: Color): void {
		this._colorPicker.color = color;
		this.state.store("color", this._colorPicker.color);
	}

	public build() {
		this._paletteView.palette = this.data.palette;
		this._paletteView.color = this.state.load("color") || rgba(0, 0, 0, 0);

		this._paletteView.redraw();
	}
}

export default PaletteInspector;
