import "./tile-cell.scss";

import { Cell } from "src/ui/components";
import { ColorPalette } from "src/engine/rendering";
import { Tile } from "src/engine/objects";
import TileView from "src/debug/components/tile-view";

class TileCell extends Cell<Tile> {
	public static readonly tagName = "wf-debug-tile-cell";
	public view: TileView = (<TileView />) as TileView;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.appendChild(this.view);
	}

	protected disconnectedCallback(): void {
		this.view.remove();
		super.disconnectedCallback();
	}

	cloneNode(deep?: boolean): TileCell {
		const clone = super.cloneNode(deep) as TileCell;
		clone.onclick = this.onclick;
		clone.palette = this.palette;
		return clone;
	}

	set palette(palette: ColorPalette) {
		this.view.palette = palette;
	}
	get palette(): ColorPalette {
		return this.view.palette;
	}

	set data(tile: Tile) {
		this.view.tile = tile;
	}

	get data(): Tile {
		return this.view.tile;
	}
}

export default TileCell;
