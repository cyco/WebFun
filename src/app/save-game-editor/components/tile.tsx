import "./tile.scss";

import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";
import { PaletteView } from "src/app/webfun/ui";
import { Size } from "src/util";
import { Tile } from "src/engine/objects";

class TileComponent extends Component {
	public static readonly tagName = "wf-save-game-editor-tile";
	private _palette: ColorPalette;
	private _tile: Tile = null;
	private _image: HTMLElement = document.createElement("div");

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this._image);
	}

	set tile(tile: Tile) {
		this._tile = tile;

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
	}

	get tile() {
		return this._tile;
	}

	set palette(p) {
		this._palette = p;
	}

	get palette(): ColorPalette {
		return this._palette;
	}
}

export default TileComponent;
