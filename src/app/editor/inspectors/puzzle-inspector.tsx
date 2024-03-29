import AbstractInspector from "./abstract-inspector";
import { List } from "src/ui/components";
import { Puzzle, Tile } from "src/engine/objects";
import { PuzzleInspectorCell } from "../components";
import ServiceContainer from "../service-container";

class PuzzleInspector extends AbstractInspector {
	private _list: List<Puzzle>;

	constructor(state: Storage, di: ServiceContainer) {
		super(state, di);

		this.window.title = "Puzzles";
		this.window.autosaveName = "puzzle-inspector";
		this.window.style.width = "300px";
		this.window.content.style.height = "396px";
		this.window.content.style.flexDirection = "column";

		this._list = document.createElement(List.tagName) as List<Puzzle>;
		this._list.state = state.prefixedWith("list");
		this._list.cell = document.createElement(PuzzleInspectorCell.tagName) as PuzzleInspectorCell;
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");

		this.window.content.appendChild(this._list);
	}

	build(): void {
		const cell = this._list.cell as PuzzleInspectorCell;
		cell.tiles = this.data.currentData.getAll(Tile);
		cell.palette = this.data.palette;
		this._list.items = this.data.currentData.getAll(Puzzle);
	}

	prepareListSearch(searchValue: string, _: List<Puzzle>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(
		searchValue: RegExp[],
		puzzle: Puzzle,
		_1: PuzzleInspectorCell,
		_2: List<Puzzle>
	): boolean {
		const string = puzzle.id + " " + puzzle.type.name + " " + puzzle.name;
		puzzle.strings.join(" ") + (puzzle.item1?.name ?? "") + (puzzle.item2?.name ?? "");
		return searchValue.every(r => r.test(string));
	}
}

export default PuzzleInspector;
