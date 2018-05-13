import { Cell, Label } from "src/ui/components";
import { Char } from "src/engine/objects";
import CSSTileSheet from "../css-tile-sheet";
import "./character-inspector-cell.scss";

class CharacterInspectorCell extends Cell<Char> {
	public static readonly TagName: string = "wf-character-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: CSSTileSheet;
	private _id: HTMLElement;
	private _name: HTMLElement;
	private _tile: HTMLElement;
	private _text: HTMLElement;

	constructor() {
		super();

		this._tile = document.createElement("div");
		this._tile.classList.add("tile");

		this._text = document.createElement("div");
		this._text.classList.add("text");

		this._id = document.createElement("span");
		this._id.classList.add("id");

		this._name = document.createElement(Label.TagName);
		this._name.classList.add("name");
		this._name.onchange = () => {
			(<any>this.data)._name = this._name.textContent;
		};

		this._text.appendChild(this._id);
		this._text.appendChild(this._name);
	}

	public cloneNode(deep?: boolean): Node {
		const node = <CharacterInspectorCell>super.cloneNode(deep);
		node.tileSheet = this.tileSheet;
		node.onclick = this.onclick;
		return node;
	}

	protected connectedCallback() {
		const tile = this.data.frames[0].extensionRight;
		this._tile.className =
			"tile " + (tile ? this.tileSheet.cssClassesForTile(tile.id).join(" ") : "");
		this._id.textContent = `${this.data.id}`;
		this._name.textContent = `${this.data.name}`;

		this.appendChild(this._tile);
		this.appendChild(this._text);
	}

	protected disconnectedCallback() {
		this._tile.remove();
		this._text.remove();
	}
}

export default CharacterInspectorCell;
