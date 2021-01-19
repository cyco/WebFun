import "./popover-tile-picker.scss";

import AbstractPopoverTilePicker from "./abstract-popover-tile-picker";
import TilePicker from "./tile-picker";
import { Tile } from "src/engine/objects";

class PopoverTilePicker extends AbstractPopoverTilePicker {
	public static readonly tagName = "wf-resource-editor-popover-tile-picker";

	protected pickerOnChange(_: TilePicker, e: CustomEvent): void {
		this.tile = e.detail.tile as Tile;
		this.dispatchEvent(new CustomEvent("change", { detail: { tile: this.tile }, bubbles: true }));
	}
}

export default PopoverTilePicker;
