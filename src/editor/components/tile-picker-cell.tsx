import "./tile-picker-cell.scss";

import { Cell } from "src/ui/components";
import { ColorPalette } from "src/engine/rendering";
import { Tile } from "src/engine/objects";
import { TileView } from "src/debug/components";

class TilePickerCell extends Cell<Tile> {
	public static readonly tagName = "wf-tile-picker-cell";
	public static readonly observedAttributes: string[] = [];
	private view: TileView = <TileView /> as TileView;

	protected connectedCallback() {
		super.connectedCallback();
		this.appendChild(this.view);
	}

	protected disconnectedCallback() {
		this.view.remove();
		super.disconnectedCallback();
	}

	public cloneNode(deep?: boolean): TilePickerCell {
		const node = super.cloneNode(deep) as TilePickerCell;
		node.palette = this.palette;
		node.onclick = this.onclick;

		return node;
	}

	set data(tile: Tile) {
		this.view.tile = tile;
	}

	get data() {
		return this.view.tile;
	}

	set palette(palette: ColorPalette) {
		this.view.palette = palette;
	}

	get palette() {
		return this.view.palette;
	}
}

export default TilePickerCell;
