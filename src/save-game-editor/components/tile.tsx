import { Component } from "src/ui";
import { Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import { ColorPalette } from "src/engine/rendering";
import { PaletteView } from "src/editor/components";
import { Size } from "src/util";
import "./tile.scss";

class TileComponent extends Component {
	public static readonly tagName = "wf-save-game-editor-tile";
	private _tileSheet: CSSTileSheet;
	private _palette: ColorPalette;
	private _tile: Tile = null;
	private _image: HTMLElement = document.createElement("div");

	protected connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._image);
	}

	set tile(tile: Tile) {
		this._tile = tile;

		let className = "";
		if (this._tile && this._tileSheet) {
			className = this.tileSheet.cssClassNameForTile(this.tile.id);
		}
		if (this._tile && this._palette) {
			const newImage = (
				<PaletteView
					size={new Size(Tile.WIDTH, Tile.HEIGHT)}
					palette={this.palette}
					image={this._tile.imageData}
				/>
			);
			this._image.replaceWith(newImage);
			this._image = newImage;
		}
		this._image.className = className;
	}

	get tile() {
		return this._tile;
	}

	set tileSheet(tileSheet: CSSTileSheet) {
		this._tileSheet = tileSheet;
		this.tile = this.tile;
	}

	get tileSheet() {
		return this._tileSheet;
	}

	set palette(p) {
		this._palette = p;
	}

	get palette() {
		return this._palette;
	}
}

export default TileComponent;