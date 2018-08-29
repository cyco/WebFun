import Component from "src/ui/component";
import { CharFrame } from "src/engine/objects";
import PopoverTilePicker from "./popover-tile-picker";
import "./character-frame-preview.scss";

class CharacterFramePreview extends Component {
	public static readonly tagName = "wf-character-frame-preview";
	public static readonly observedAttributes: string[] = [];

	private _frame: CharFrame;
	private _pickers: PopoverTilePicker[] = (8).times(() => <PopoverTilePicker /> as PopoverTilePicker);

	protected connectedCallback() {
		super.connectedCallback();
		this._pickers.forEach(t => this.appendChild(t));
		this._rebuild();
	}

	protected disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}

	private _rebuild() {
		const tiles = this._frame ? this._frame.tiles : (8).times(() => null);
		this._pickers.forEach((p, idx) => (p.tile = tiles[idx]));
	}

	set tiles(t) {
		this._pickers.forEach(p => (p.tiles = t));
	}

	get tiles() {
		return this._pickers.first().tiles;
	}

	set tileSheet(s) {
		this._pickers.forEach(p => (p.tileSheet = s));
	}

	get tileSheet() {
		return this._pickers.first().tileSheet;
	}

	set frame(f: CharFrame) {
		this._frame = f;
		this._rebuild();
	}

	get frame() {
		return this._frame;
	}
}

export default CharacterFramePreview;
