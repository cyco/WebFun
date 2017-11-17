import { Cell } from "src/ui/components";
import { Tile } from "src/engine/objects";
import "./tile-picker-cell.scss";
import TileSheet from "src/editor/tile-sheet";

class TilePickerCell extends Cell<Tile> {
	public static readonly TagName = "wf-tile-picker-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: TileSheet;

	connectedCallback() {
		super.connectedCallback();

		if (this.data) {
			this.className = this.tileSheet.cssClassesForTile(this.data.id).join(" ");
		} else {
			this.className = "empty";
		}
	}

	public cloneNode(deep?: boolean): TilePickerCell {
		const node = <TilePickerCell>super.cloneNode(deep);
		node.tileSheet = this.tileSheet;
		node.onclick = this.onclick;
		return node;
	}
}

export default TilePickerCell;
