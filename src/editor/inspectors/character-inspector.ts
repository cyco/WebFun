import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { List } from "src/ui/components";
import { CharacterInspectorCell } from "../components";
import Char from "src/engine/objects/char";

class CharacterInspector extends AbstractInspector {
	private _list: List<Char>;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Characters";
		this.window.autosaveName = "character-inspector";
		this.window.style.width = "230px";
		this.window.content.style.height = "450px";
		this.window.content.style.flexDirection = "column";

		this._list = <List<Char>>document.createElement(List.TagName);
		this._list.cell = <CharacterInspectorCell>document.createElement(CharacterInspectorCell.TagName);
		this._list.cell.onclick = (e: MouseEvent) => this._onCellClicked(<CharacterInspectorCell>e.currentTarget);
		this._list.classList.add("character-inspector-list");
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");

		this.window.content.appendChild(this._list);
	}

	private _onCellClicked(cell: CharacterInspectorCell) {
		const selectedCell = this._list.querySelector("[selected]");
		if (selectedCell) selectedCell.removeAttribute("selected");
		cell.setAttribute("selected", "");
	}

	public build() {
		const cell = <CharacterInspectorCell>this._list.cell;
		cell.tileSheet = this.data.tileSheet;
		this._list.items = this.data.currentData.characters;
	}

	public prepareListSearch(searchValue: string, list: List<Char>): any {
		return null;
	}

	public includeListItem(searchValue: any, item: Char, cell: CharacterInspectorCell, list: List<Char>): boolean {
		return true;
	}
}

export default CharacterInspector;
