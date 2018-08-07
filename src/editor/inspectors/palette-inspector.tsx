import AbstractInspector from "./abstract-inspector";
import { ColorPicker, PaletteColorPicker } from "../components";
import { IconButton } from "src/ui/components";
import { Color, Size, download, rgba } from "src/util";
import { ModalPrompt } from "src/ux";

class PaletteInspector extends AbstractInspector {
	private _paletteView = (
		<PaletteColorPicker
			size={new Size(16, 16)}
			style={{ width: "194px", height: "194px" }}
			onchange={() => this.editColor(this._paletteView.color as Color)}
		/>
	) as PaletteColorPicker;
	private _colorPicker: ColorPicker = (
		<ColorPicker
			style={{
				height: "184px",
				minWidth: "182px",
				marginLeft: "12px",
				marginTop: "10px"
			}}
			color={this.state.load("color") || rgba(0, 0, 0, 0)}
			onchange={() => this._paletteView.updateCurrentColor(this._colorPicker.color)}
		/>
	) as ColorPicker;
	private _download: IconButton = (
		<IconButton icon="download" onclick={() => this.downloadPalette()} />
	) as IconButton;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Palette";
		this.window.autosaveName = "palette-inspector";
		this.window.style.width = "398px";
		this.window.content.style.height = "204px";
		this.window.content.style.flexDirection = "row";

		this.window.content.appendChild(this._paletteView);
		this.window.content.appendChild(this._colorPicker);

		this.window.addTitlebarButton(this._download);
	}

	async downloadPalette() {
		const type = await ModalPrompt("Pick file format:", {
			defaultValue: "gpl",
			options: [
				{ label: "GIMP Palette", value: "gpl" },
				{ label: "Adobe Color Table", value: "act" }
			]
		});
		if (type === null) return;

		const name = "Yoda Stories";
		const data =
			type === "gpl"
				? this._paletteView.palette.toGIMP(name)
				: this._paletteView.palette.toAdobeColorTable();
		download(data, `${name}.${type}`);
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
