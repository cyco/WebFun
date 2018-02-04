import { Component } from "src/ui";
import { Tile } from "src/engine/objects";
import { CSSTileSheet } from "src/editor";
import "./tile.scss";

class TileComponent extends Component {
	public static readonly TagName = "wf-save-game-editor-tile";
	private _tileSheet: CSSTileSheet;
	private _tile: Tile = null;
	private _image: HTMLElement = document.createElement("div");

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._image);
	}

	set tile(tile: Tile) {
		this._tile = tile;

		let className = "";
		if (this._tile && this._tileSheet) {
			className = this.tileSheet.cssClassNameForTile(this.tile.id);
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
}

export default TileComponent;
