import { Character, Sound, Tile } from "src/engine/objects";
import { CharacterDetails, CharacterInspectorCell } from "../components";
import { IconButton, List } from "src/ui/components";

import AbstractInspector from "src/app/editor/inspectors/abstract-inspector";
import ServiceContainer from "../service-container";
import { Updater } from "../reference";
import { NullIfMissing } from "src/engine/asset-manager";

class CharacterInspector extends AbstractInspector {
	private _list: List<Character>;
	private _details: CharacterDetails;
	private readonly updater = this.di.get(Updater);

	constructor(state: Storage, di: ServiceContainer) {
		super(state, di);

		this.window.title = "Characters";
		this.window.autosaveName = "character-inspector";
		this.window.style.width = "416px";
		this.window.content.style.height = "280px";
		this.window.addTitlebarButton(
			<IconButton icon="plus" title="Add new character" onclick={() => this.addCharacter()} />
		);

		this._list = (<List state={state.prefixedWith("list")} />) as List<Character>;
		this._list.cell = (
			<CharacterInspectorCell
				className="character-inspector-list"
				searchDelegate={this}
				onclick={(e: MouseEvent) => this._onCellClicked(e.currentTarget as CharacterInspectorCell)}
				onchange={(e: CustomEvent) =>
					this.renameCharacter((e.detail.cell as CharacterInspectorCell).data, e.detail.name)
				}
				onremove={(e: CustomEvent) =>
					this.removeCharacter((e.detail.cell as CharacterInspectorCell).data)
				}
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

	public addCharacter(): void {
		const newCharacter = new Character(
			this.data.currentData.getAll(Character).length,
			this.data.currentData.getAll(Character).last(),
			this.data.currentData
		);
		newCharacter.name = "New Character";
		newCharacter.id = this.data.currentData.getAll(Character).length;
		this.data.currentData.getAll(Character).push(newCharacter);
		this._list.items = this.data.currentData.getAll(Character);
	}

	public renameCharacter(character: Character, name: string): void {
		character.name = name;
	}

	public removeCharacter(character: Character): void {
		const index = this.data.currentData.getAll(Character).indexOf(character);
		if (index === -1) return;
		if (!confirm(`Delete character ${character.id} (${character.name})?`)) {
			return;
		}
		this.updater.deleteItem(character);
		this._list.items = this.data.currentData.getAll(Character);
	}

	public build(): void {
		this._details.palette = this.data.palette;
		this._details.sounds = this.data.currentData.getAll(Sound).map(s => s.file);
		this._details.weapons = this.data.currentData
			.getAll(Character)
			.filter(c => c.type === Character.Type.Weapon);
		this._details.tiles = this.data.currentData.getAll(Tile);
		this._details.palette = this.data.palette;

		const cell = this._list.cell as CharacterInspectorCell;
		cell.palette = this.data.palette;
		this._list.items = this.data.currentData.getAll(Character);
	}

	prepareListSearch(searchValue: string, _: List<Character>): RegExp[] {
		this.stateDidChange();
		return searchValue.split(" ").map(s => new RegExp(s, "i"));
	}

	includeListItem(
		searchValue: RegExp[],
		item: Character,
		_1: CharacterInspectorCell,
		_2: List<Character>
	): boolean {
		const searchableAttributes = [item.id, item.name, item.movementType.name];

		if (item.isWeapon()) {
			const sound = this.data.currentData.get(Sound, item.reference, NullIfMissing);
			if (sound) {
				searchableAttributes.push(sound.file);
			}
		} else {
			const weapon = this.data.currentData.get(Character, item.reference, NullIfMissing);
			if (weapon) {
				searchableAttributes.push(weapon.name);
			}
		}

		const string = searchableAttributes.join(" ");
		return searchValue.every(r => r.test(string));
	}
}

export default CharacterInspector;
