import { Cell } from "src/ui/components";
import { Tile } from "src/engine/objects";
import CSSTileSheet from "src/editor/css-tile-sheet";
import "./tile-cell.scss";

class TileCell extends Cell<Tile> {
	public tileSheet: CSSTileSheet;
	public static readonly tagName = "wf-debug-tile-cell";

	cloneNode(deep?: boolean): TileCell {
		const clone = <TileCell>super.cloneNode(deep);
		clone.onclick = this.onclick;
		clone.tileSheet = this.tileSheet;
		return clone;
	}

	set data(tile: Tile) {
		const div = document.createElement("div");
		div.className = this.tileSheet.cssClassNameForTile(tile.id);
		this.textContent = "";
		this.appendChild(div);
	}

	get data() {
		return null;
	}
}

export default TileCell;
