import { Cell } from "src/ui/components";
import { Puzzle, PuzzleType } from "src/engine/objects";
import "./puzzle-inspector-cell.scss";
import TileSheet from "../tile-sheet";

class PuzzleInspectorCell extends Cell<Puzzle> {
	public static readonly TagName: string = "wf-puzzle-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: TileSheet;
	private _tile1: HTMLElement;
	private _tile2: HTMLElement;
	private _text: HTMLElement;
	private _id: HTMLElement;
	private _type: HTMLElement;

	constructor() {
		super();

		this._tile1 = document.createElement("div");
		this._tile1.classList.add("tile");
		this._tile2 = document.createElement("div");
		this._tile2.classList.add("tile");
		this._text = document.createElement("span");
		this._text.classList.add("text");
		this._id = document.createElement("span");
		this._id.classList.add("id");
		this._text.appendChild(this._id);
		this._type = document.createElement("span");
		this._type.classList.add("type");
		this._text.appendChild(this._type);
	}

	public cloneNode(): Node {
		const node = <PuzzleInspectorCell>super.cloneNode();
		node.tileSheet = this.tileSheet;
		return node;
	}

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this._type.textContent = this.formatType(this.data.type);

		this._tile1.className = "tile";
		if (this.data.item1) {
			this._tile1.className += " " + this.tileSheet.cssClassesForTile(this.data.item1.id).join(" ");
		}

		this._tile2.className = "tile";
		if (this.data.item2) {
			this._tile2.className += " " + this.tileSheet.cssClassesForTile(this.data.item2.id).join(" ");
		}

		this.appendChild(this._tile1);
		this.appendChild(this._tile2);
		this.appendChild(this._text);
	}

	private formatType(type: PuzzleType): string {
		switch (type) {
			case PuzzleType.End:
				return "Goal";
			case PuzzleType.U1:
				return "Unknown 1";
			case PuzzleType.U2:
				return "Unknown 2";
			case PuzzleType.U3:
				return "Unknown 3";
			case PuzzleType.U4:
				return "Unknown 4";
		}

		return "";
	}
}

export default PuzzleInspectorCell;
