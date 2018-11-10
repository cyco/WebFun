import AbstractPopoverTilePicker from "./abstract-popover-tile-picker";
import TilePicker from "./tile-picker";
import { Char } from "src/engine/objects";

class PopoverCharacterPicker extends AbstractPopoverTilePicker {
	public static readonly tagName = "wf-resource-editor-popover-character-picker";
	private _characters: Char[];
	private _character: Char;

	protected pickerOnChange(_: TilePicker, e: CustomEvent) {
		this.character = this._characters[e.detail.index as number];
		this.dispatchEvent(
			new CustomEvent("change", { detail: { character: this.character }, bubbles: true })
		);
	}

	set characters(c) {
		this._characters = c;
		this.tiles = c.map(c => c.frames[0].extensionRight);
	}

	get characters() {
		return this._characters;
	}

	set character(c) {
		this._character = c;
		this.tile = c ? c.frames[0].extensionRight : null;
	}

	get character() {
		return this._character;
	}
}

export default PopoverCharacterPicker;
