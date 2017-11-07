import AbstractInspector from "./abstract-inspector";
import { PuzzleInspectorCell } from "../components";
import { Puzzle } from "src/engine/objects";
import { List } from "src/ui/components";

class PuzzleInspector extends AbstractInspector {
	private _list: List<Puzzle>;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Puzzles";
		this.window.autosaveName = "puzzle-inspector";
		this.window.style.width = "300px";
		this.window.content.style.height = "396px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Puzzle>>document.createElement(List.TagName);
		this._list.cell = <PuzzleInspectorCell>document.createElement(PuzzleInspectorCell.TagName);
		this._list.classList.add("puzzle-inspector-list");
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");
		this.window.content.appendChild(this._list);
	}

	build() {
		const cell = <PuzzleInspectorCell>this._list.cell;
		cell.tileSheet = this.data.tileSheet;
		this._list.items = this.data.currentData.puzzles;
	}

	prepareListSearch(searchValue: string, list: List<Puzzle>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], puzzle: Puzzle, cell: PuzzleInspectorCell, list: List<Puzzle>): boolean {
		const string = puzzle.id + " " + puzzle.strings.join(" ") + puzzle.item1.name + (puzzle.item2 ? puzzle.item2.name : "");
		return searchValue.every(r => r.test(string));
	}
}

export default PuzzleInspector;
