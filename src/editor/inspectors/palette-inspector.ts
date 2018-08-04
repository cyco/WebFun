import AbstractInspector from "./abstract-inspector";
import { ColorPicker, PaletteView } from "../components";
import { IconButton } from "src/ui/components";
import { Color, Point, Size, download } from "src/util";

class PaletteInspector extends AbstractInspector {
	private _paletteView: PaletteView = <PaletteView>document.createElement(PaletteView.tagName);
	private _colorPicker: ColorPicker = <ColorPicker>document.createElement(ColorPicker.tagName);
	private _download: IconButton = <IconButton>document.createElement(IconButton.tagName);
	private _paletteEntrySize = new Size(192 / 16, 192 / 16);

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
		this._paletteView.onclick = (e: MouseEvent) => this._onPaletteClick(e);
		const highlight = new Point(state.load("tile-x") | 0, state.load("tile-y") | 0);
		this._paletteView.moveHighlighterTo(highlight);
		this.window.content.appendChild(this._paletteView);

		this._colorPicker.style.height = "184px";
		this._colorPicker.style.minWidth = "182px";
		this._colorPicker.style.marginLeft = "12px";
		this._colorPicker.style.marginTop = "10px";
		this._colorPicker.color = state.load("color") || "rgb(0, 255, 0)";
		this.window.content.appendChild(this._colorPicker);

		this._download.icon = "download";
		this._download.onclick = () =>
			download(this._paletteView.palette.toGIMP("Yoda Stories"), "Yoda Stories.gpl");
		(this.window as any)._titlebar.addButton(this._download);
	}

	private _onPaletteClick(event: MouseEvent) {
		const point = new Point(event.offsetX, event.offsetY).subtract(1, 1);
		const tile = point.dividedBy(this._paletteEntrySize).floor();
		if (tile.x < 0 || tile.x > 15 || tile.y < 0 || tile.y > 15) return;

		this.editColor(tile.y * 16 + tile.x);
	}

	public editColor(index: number): void {
		const point = new Point(index % 16, Math.floor(index / 16)).scaleBy(
			this._paletteEntrySize.width
		);
		this._paletteView.moveHighlighterTo(point);
		this.state.store("tile-x", point.x);
		this.state.store("tile-y", point.y);

		const palette = this._paletteView.palette;
		const [b, g, r] = palette.slice(4 * index, 4 * index + 3);
		this._colorPicker.color = new Color(r, g, b);
		this.state.store("color", this._colorPicker.color);
	}

	public build() {
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
