import Component from "src/ui/component";
import { CharFrame } from "src/engine/objects";
import CSSTileSheet from "../css-tile-sheet";
import "./character-frame-preview.scss";

class CharacterFramePreview extends Component {
	public static readonly tagName = "wf-character-frame-preview";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: CSSTileSheet;
	private _frame: CharFrame;

	protected connectedCallback() {
		this._rebuild();
	}

	protected disconnectedCallback() {
		this.textContent = "";
	}

	private _rebuild() {
		if (!this.isConnected || !this._frame) return;

		this.textContent = "";
		this._frame.tiles
			.map(tile => (
				<div className={"tile" + (tile ? this.tileSheet.cssClassesForTile(tile.id).join(" ") : "")} />
			))
			.forEach(t => this.appendChild(t));
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
