import "./npc.scss";
import Component from "src/ui/component";
import NPC from "src/engine/objects/npc";
import GameData from "src/engine/game-data";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { Label } from "src/ui/components";

class NPCComponent extends Component {
	static readonly TagName = "wf-zone-editor-npc";
	public data: GameData;
	public tileSheet: CSSTileSheet;

	private _npc: NPC;

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


	public set npc(npc: NPC) {
		this._npc = npc;

		const char = npc.face;
		this._name.textContent = char.name;

		const tile = char.frames[0].extensionRight;
		this._tile.className = `tile ${this.tileSheet.cssClassNameForTile(tile.id)}`;
	}

	public get npc() {
		return this._npc;
	}
}

export default NPCComponent;
