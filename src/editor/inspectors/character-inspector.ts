import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { List } from "src/ui/components";
import { CharacterDetails, CharacterInspectorCell } from "../components";
import { Char, CharType } from "src/engine/objects";

class CharacterInspector extends AbstractInspector {
	private _list: List<Char>;
	private _details: CharacterDetails;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Characters";
		this.window.autosaveName = "character-inspector";
		this.window.style.width = "430px";
		this.window.content.style.height = "280px";

		this._list = <List<Char>>document.createElement(List.TagName);
		this._list.cell = <CharacterInspectorCell>document.createElement(CharacterInspectorCell.TagName);
		this._list.cell.onclick = (e: MouseEvent) => this._onCellClicked(<CharacterInspectorCell>e.currentTarget);
		this._list.classList.add("character-inspector-list");
		this._list.searchDelegate = this;
		this._list.state = state.prefixedWith("list");
		this.window.content.appendChild(this._list);

		this._details = <CharacterDetails>document.createElement(CharacterDetails.TagName);
		this.window.content.appendChild(this._details);
	}

	private _onCellClicked(cell: CharacterInspectorCell) {
		const selectedCell = this._list.querySelector("[selected]");
		if (selectedCell) selectedCell.removeAttribute("selected");
		cell.setAttribute("selected", "");

		this._details.character = cell.data;
	}

	public build() {
		this._details.tileSheet = this.data.tileSheet;
		this._details.sounds = this.data.currentData.sounds;
		this._details.weapons = this.data.currentData.characters.filter(c => c.type === CharType.Weapon);

		const cell = <CharacterInspectorCell>this._list.cell;
		cell.tileSheet = this.data.tileSheet;
		this._list.items = this.data.currentData.characters;
	}

	prepareListSearch(searchValue: string, list: List<Char>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Char, cell: CharacterInspectorCell, list: List<Char>): boolean {
		const searchableAttributes = [item.id, item.name, item.movementType.name];

		if (item.isWeapon()) {
			const sound = this.data.currentData.sounds[item.reference];
			if (sound) {
				searchableAttributes.push(sound);
			}
		} else {
			const weapon = this.data.currentData.characters[item.reference];
			if (weapon) {
				searchableAttributes.push(weapon.name);
			}
		}

		const string = searchableAttributes.join(" ");
		return searchValue.every(r => r.test(string));
	}
}

export default CharacterInspector;
