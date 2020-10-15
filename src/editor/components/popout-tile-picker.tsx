import "./popout-tile-picker.scss";

import AbstractPopoutTilePicker from "./abstract-popout-tile-picker";
import TilePicker from "./tile-picker";
import { ColorPalette } from "src/engine/rendering";
import { Tile } from "src/engine/objects";

class PopoutTilePicker extends AbstractPopoutTilePicker {
	public static readonly tagName = "wf-resource-editor-popout-tile-picker";
	public tiles: Tile[];
	public tile: Tile;
	public palette: ColorPalette;

	protected pickerOnChange(_: TilePicker, e: CustomEvent): void {
		this.tile = e.detail.tile as Tile;
		this.dispatchEvent(new CustomEvent("change", { detail: { tile: this.tile }, bubbles: true }));
	}
}

export default PopoutTilePicker;
