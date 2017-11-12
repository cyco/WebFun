import { Cell } from "src/ui/components";
import { Puzzle, PuzzleType } from "src/engine/objects";
import "./puzzle-inspector-cell.scss";
import TileSheet from "../tile-sheet";
import Tile from "src/engine/objects/tile";
import { ExpandButton } from "src/editor/components";

class PuzzleInspectorCell extends Cell<Puzzle> {
	public static readonly TagName: string = "wf-puzzle-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: TileSheet;
	private _tile1: HTMLElement;
	private _tile2: HTMLElement;
	private _title: HTMLElement;
	private _id: HTMLElement;
	private _type: HTMLElement;
	private _button: ExpandButton;

	private _text: HTMLElement;

	constructor() {
		super();

		this._tile1 = document.createElement("div");
		this._tile1.classList.add("tile");
		this._tile2 = document.createElement("div");
		this._tile2.classList.add("tile");
		this._title = document.createElement("span");
		this._title.classList.add("title");
		this._id = document.createElement("span");
		this._id.classList.add("id");
		this._title.appendChild(this._id);
		this._type = document.createElement("span");
		this._type.classList.add("type");
		this._title.appendChild(this._type);

		this._button = <ExpandButton>document.createElement(ExpandButton.TagName);
		this._button.element = this;
		this._title.appendChild(this._button);

		this._text = document.createElement("span");
		this._text.classList.add("text");
	}

	public cloneNode(deep?: boolean): Node {
		const node = <PuzzleInspectorCell>super.cloneNode(deep);
		node.tileSheet = this.tileSheet;
		return node;
	}

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this._type.textContent = this.formatType(this.data.type);

		this._prepareTile(this.data.item1, this._tile1);
		this.appendChild(this._tile1);

		this._prepareTile(this.data.item2, this._tile2);
		if (this.data.item2) {
			this.appendChild(this._tile2);
		} else this._tile1.classList.add("double");

		this.appendChild(this._title);

		this.data.strings.forEach(s => {
			if (!s.length) return;

			const container = document.createElement("div");
			container.textContent = s;
			this._text.appendChild(container);
		});

		this.appendChild(document.createElement("br"));
		this.appendChild(this._text);

		this.style.setProperty("--text-height", this._text.getBoundingClientRect().height + "px");
	}

	private _prepareTile(tile: Tile, node: HTMLElement) {
		node.className = "tile";
		node.title = "";
		if (!tile) return;

		node.title = tile.name;
		node.className += " " + this.tileSheet.cssClassesForTile(this.data.item1.id).join(" ");
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

	disconnectedCallback() {
		this._id.remove();
		this._type.remove();
		this._tile1.remove();
		this._tile2.remove();
		this._title.remove();
	}
}

export default PuzzleInspectorCell;
