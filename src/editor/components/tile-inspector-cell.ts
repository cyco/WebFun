import { Cell } from "src/ui/components";
import { Tile } from "src/engine/objects";
import "./tile-inspector-cell.scss";

class TileInspectorCell extends Cell<Tile> {
	public static readonly TagName: string = "wf-tile-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	private _id = document.createElement("span");

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this.appendChild(this._id);
	}
}

export default TileInspectorCell;
