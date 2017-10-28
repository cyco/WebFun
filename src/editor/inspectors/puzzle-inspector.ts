import AbstractInspector from "./abstract-inspector";
import { PuzzleInspectorCell } from "../components";
import { Puzzle } from "src/engine/objects";
import { List } from "src/ui/components";

class PuzzleInspector extends AbstractInspector {
	private _list: List<Puzzle>;

	constructor() {
		super();

		this.window.title = "Puzzles";
		this.window.autosaveName = "puzzle-inspector";
		this.window.style.width = "300px";
		this.window.content.style.maxHeight = "300px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Puzzle>>document.createElement(List.TagName);
		this._list.cell = <PuzzleInspectorCell>document.createElement(PuzzleInspectorCell.TagName);

		this.window.content.appendChild(this._list);
	}

	build() {
		this._list.items = this.data.currentData.tiles;
	}
}

export default PuzzleInspector;
