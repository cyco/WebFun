import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { List, IconButton } from "src/ui/components";
import { CharacterDetails, CharacterInspectorCell } from "../components";
import { Char, CharType } from "src/engine/objects";
import { MutableChar } from "src/engine/mutable-objects";

class CharacterInspector extends AbstractInspector {
	private _list: List<Char>;
	private _details: CharacterDetails;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Characters";
		this.window.autosaveName = "character-inspector";
		this.window.style.width = "430px";
		this.window.content.style.height = "280px";
		this.window.addTitlebarButton(
			<IconButton icon="plus" title="Add new zone" onclick={() => this.addCharacter()} />
		);

		this._list = <List state={state.prefixedWith("list")} /> as List<Char>;
		this._list.cell = (
			<CharacterInspectorCell
				className="character-inspector-list"
				searchDelegate={this}
				onclick={(e: MouseEvent) => this._onCellClicked(e.currentTarget as CharacterInspectorCell)}
			/>
		) as CharacterInspectorCell;
		this.window.content.appendChild(this._list);

		this._details = <CharacterDetails /> as CharacterDetails;
		this.window.content.appendChild(this._details);
	}

	private _onCellClicked(cell: CharacterInspectorCell) {
		const selectedCell = this._list.querySelector("[selected]");
		if (selectedCell) selectedCell.removeAttribute("selected");
		cell.setAttribute("selected", "");

		this._details.character = cell.data;
	}

	public addCharacter() {
		const newCharacter = new MutableChar(this.data.currentData.characters.last());
		newCharacter.name = "New Character";
		this.data.currentData.characters.push(newCharacter);
		this._list.items = this.data.currentData.characters;
	}

	public build() {
		this._details.tileSheet = this.data.tileSheet;
		this._details.sounds = this.data.currentData.sounds;
		this._details.weapons = this.data.currentData.characters.filter(c => c.type === CharType.Weapon);

		const cell = this._list.cell as CharacterInspectorCell;
		cell.tileSheet = this.data.tileSheet;
		this._list.items = this.data.currentData.characters;
	}

	prepareListSearch(searchValue: string, _: List<Char>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(searchValue: RegExp[], item: Char, _1: CharacterInspectorCell, _2: List<Char>): boolean {
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
