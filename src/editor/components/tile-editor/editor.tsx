import { Panel } from "src/ui/components";
import PaletteImageEditor from "../palette-image-editor";
import PaletteColorPicker from "../palette-color-picker";
import { ColorPalette } from "src/engine/rendering";
import { Size, rgba } from "src/util";
import "./editor.scss";

class Editor extends Panel {
	static tagName = "wf-editor-tile-editor";
	public title = "Tile Editor";
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
