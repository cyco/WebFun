import "./character-frame-preview.scss";

import { Component } from "src/ui";
import { Character, Tile } from "src/engine/objects";
import { ColorPalette } from "src/engine";
import PopoverTilePicker from "./popover-tile-picker";

class CharacterFramePreview extends Component {
	public static readonly tagName = "wf-character-frame-preview";
	public static readonly observedAttributes: string[] = [];

	public onchange: (e: CustomEvent) => void = () => void 0;
	private _frame: Character.Frame;
	private _pickers: PopoverTilePicker[] = (8).times(
		idx =>
			(
				<PopoverTilePicker
					onchange={({ currentTarget }: CustomEvent) =>
						this.dispatchEvent(
							new CustomEvent("change", {
								detail: { idx: idx, tile: (currentTarget as PopoverTilePicker).tile }
							})
						)
					}
				/>
			) as PopoverTilePicker
	);

	protected connectedCallback(): void {
		super.connectedCallback();
		this._pickers.forEach(t => this.appendChild(t));
		this._rebuild();
	}

	protected disconnectedCallback(): void {
		this.textContent = "";
		super.disconnectedCallback();
	}

	private _rebuild() {
		const tiles = this._frame ? this._frame.tiles : (8).times(() => null);
		this._pickers.forEach((p, idx) => (p.tile = tiles[idx]));
	}

	set tiles(t: Tile[]) {
		this._pickers.forEach(p => (p.tiles = t));
	}

	get tiles(): Tile[] {
		return this._pickers.first().tiles;
	}

	set palette(p: ColorPalette) {
		this._pickers.forEach(picker => (picker.palette = p));
	}

	get palette(): ColorPalette {
		return this._pickers[0].palette;
	}

	set frame(f: Character.Frame) {
		this._frame = f;
		this._rebuild();
	}

	get frame(): Character.Frame {
		return this._frame;
	}
}

export default CharacterFramePreview;
