import "./popout-tile-picker.scss";

import AbstractPopoutTilePicker from "./abstract-popout-tile-picker";
import TilePicker from "./tile-picker";
import { Tile } from "src/engine/objects";

class PopoutTilePicker extends AbstractPopoutTilePicker {
	public static readonly tagName = "wf-resource-editor-popout-tile-picker";

	protected pickerOnChange(_: TilePicker, e: CustomEvent): void {
		this.tile = e.detail.tile as Tile;
		this.dispatchEvent(new CustomEvent("change", { detail: { tile: this.tile }, bubbles: true }));
	}
}

export default PopoutTilePicker;
