import { Char } from "src/engine/objects";
import { CharacterDetails, CharacterInspectorCell } from "../components";
import { IconButton, List } from "src/ui/components";

import AbstractInspector from "src/editor/inspectors/abstract-inspector";
import { MutableChar } from "src/engine/mutable-objects";

class CharacterInspector extends AbstractInspector {
	private _list: List<Char>;
	private _details: CharacterDetails;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Characters";
		this.window.autosaveName = "character-inspector";
		this.window.style.width = "416px";
		this.window.content.style.height = "280px";
		this.window.addTitlebarButton(<IconButton icon="plus" title="Add new character" onclick={() => this.addCharacter()} />);

		this._list = (<List state={state.prefixedWith("list")} />) as List<Char>;
		this._list.cell = (
			<CharacterInspectorCell
				className="character-inspector-list"
				searchDelegate={this}
				onclick={(e: MouseEvent) => this._onCellClicked(e.currentTarget as CharacterInspectorCell)}
				onchange={(e: CustomEvent) => this.renameCharacter((e.detail.cell as CharacterInspectorCell).data, e.detail.name)}
				onremove={(e: CustomEvent) => this.removeCharacter((e.detail.cell as CharacterInspectorCell).data)}
			/>
		) as CharacterInspectorCell;
		this.window.content.appendChild(this._list);

		this._details = (<CharacterDetails />) as CharacterDetails;
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

	public renameCharacter(character: MutableChar, name: string) {
		character.name = name;
	}

	public removeCharacter(character: Char) {
		const index = this.data.currentData.characters.indexOf(character);
		if (index === -1) return;
		if (!confirm(`Delete character ${character.id} (${character.name})?`)) {
			return;
		}
		this.data.currentData.characters.splice(index, 1);
		this._list.items = this.data.currentData.characters;
	}

	public build() {
		this._details.palette = this.data.palette;
		this._details.sounds = this.data.currentData.sounds.map(s => s.file);
		this._details.weapons = this.data.currentData.characters.filter(c => c.type === Char.Type.Weapon);
		this._details.tiles = this.data.currentData.tiles;
		this._details.palette = this.data.palette;

		const cell = this._list.cell as CharacterInspectorCell;
		cell.palette = this.data.palette;
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
				searchableAttributes.push(sound.file);
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
