import "./puzzle-inspector-cell.scss";

import { Puzzle, Tile } from "src/engine/objects";

import { Cell } from "src/ui/components";
import { ColorPalette } from "src/engine/rendering";
import ExpandButton from "./expand-button";
import TileView from "src/app/webfun/debug/components/tile-view";

class PuzzleInspectorCell extends Cell<Puzzle> {
	public static readonly tagName = "wf-puzzle-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public palette: ColorPalette;
	private _tile1: TileView;
	private _tile2: TileView;
	private _title: HTMLElement;
	private _id: HTMLElement;
	private _type: HTMLElement;
	private _button: ExpandButton;

	private _text: HTMLElement;

	constructor() {
		super();

		this._tile1 = document.createElement(TileView.tagName) as TileView;
		this._tile1.classList.add("tile");
		this._tile2 = document.createElement(TileView.tagName) as TileView;
		this._tile2.classList.add("tile");
		this._title = document.createElement("span");
		this._title.classList.add("title");
		this._id = document.createElement("span");
		this._id.classList.add("id");
		this._title.appendChild(this._id);
		this._type = document.createElement("span");
		this._type.classList.add("type");
		this._title.appendChild(this._type);

		this._button = document.createElement(ExpandButton.tagName) as ExpandButton;
		this._button.element = this;
		this._title.appendChild(this._button);

		this._text = document.createElement("span");
		this._text.classList.add("text");
	}

	public cloneNode(deep?: boolean): Node {
		const node = super.cloneNode(deep) as PuzzleInspectorCell;
		node.palette = this.palette;
		return node;
	}

	protected connectedCallback(): void {
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

	private _prepareTile(tile: Tile, node: TileView) {
		node.className = "tile";
		node.title = "";
		node.tile = null;
		if (!tile) return;

		node.title = tile.name;
		node.tile = this.data.item1;
		node.palette = this.palette;
	}

	private formatType(type: Puzzle.Type): string {
		switch (type) {
			case Puzzle.Type.End:
				return "Goal";
			case Puzzle.Type.Use:
				return "Unknown 1";
			case Puzzle.Type.Trade:
				return "Unknown 2";
			case Puzzle.Type.Goal:
				return "Unknown 3";
			case Puzzle.Type.U4:
				return "Unknown 4";
		}

		return "";
	}

	protected disconnectedCallback(): void {
		this._id.remove();
		this._type.remove();
		this._tile1.remove();
		this._tile2.remove();
		this._title.remove();
	}
}

export default PuzzleInspectorCell;
