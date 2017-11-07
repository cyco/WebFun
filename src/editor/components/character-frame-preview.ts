import Component from "src/ui/component";
import { CharFrame } from "src/engine/objects";
import TileSheet from "../tile-sheet";
import "./character-frame-preview.scss";

class CharacterFramePreview extends Component {
	public static readonly TagName = "wf-character-frame-preview";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: TileSheet;
	private _frame: CharFrame;

	constructor() {
		super();
	}

	connectedCallback() {
		this._rebuild();
	}

	disconnectedCallback() {
		this.textContent = "";
	}

	private _rebuild() {
		if (!this.isConnected || !this._frame) return;

		this.textContent = "";
		this._frame.tiles.forEach((tile) => {
			const tileNode = document.createElement("div");
			tileNode.className = tile ? this.tileSheet.cssClassesForTile(tile.id).join(" ") : "";
			tileNode.classList.add("tile");
			this.appendChild(tileNode);
		});
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
