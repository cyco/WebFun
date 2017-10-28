import { Cell } from "src/ui/components";
import { Puzzle } from "src/engine/objects";
import "./puzzle-inspector-cell.scss";

class PuzzleInspectorCell extends Cell<Puzzle> {
	public static readonly TagName: string = "wf-puzzle-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	private _id = document.createElement("span");

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this.appendChild(this._id);
	}
}

export default PuzzleInspectorCell;
