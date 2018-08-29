import { Cell } from "src/ui/components";
import { Tile } from "src/engine/objects";
import "./tile-picker-cell.scss";
import CSSTileSheet from "src/editor/css-tile-sheet";

class TilePickerCell extends Cell<Tile> {
	public static readonly tagName = "wf-tile-picker-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: CSSTileSheet;

	protected connectedCallback() {
		super.connectedCallback();

		if (this.data) {
			this.className = this.tileSheet.cssClassesForTile(this.data.id).join(" ");
		} else {
			this.className = "empty";
		}
	}

	public cloneNode(deep?: boolean): TilePickerCell {
		const node = super.cloneNode(deep) as TilePickerCell;
		node.tileSheet = this.tileSheet;
		node.onclick = this.onclick;
		return node;
	}
}

export default TilePickerCell;
