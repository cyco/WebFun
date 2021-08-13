import AbstractPopoverTilePicker from "./abstract-popover-tile-picker";
import { Character } from "src/engine/objects";
import TilePicker from "./tile-picker";

class PopoverCharacterPicker extends AbstractPopoverTilePicker {
	public static readonly tagName = "wf-resource-editor-popover-character-picker";
	private _characters: Character[];
	private _character: Character;

	protected pickerOnChange(_: TilePicker, e: CustomEvent): void {
		this.character = this._characters[e.detail.index as number];
		this.dispatchEvent(
			new CustomEvent("change", { detail: { character: this.character }, bubbles: true })
		);
	}

	set characters(c: Character[]) {
		this._characters = c;
		this.tiles = c.map(c => c.frames[0].extensionRight);
	}

	get characters(): Character[] {
		return this._characters;
	}

	set character(c: Character) {
		this._character = c;
		this.tile = c ? c.frames[0].extensionRight : null;
	}

	get character(): Character {
		return this._character;
	}
}

export default PopoverCharacterPicker;
