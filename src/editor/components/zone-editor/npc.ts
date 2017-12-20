import "./npc.scss";
import { Component } from "src/ui";
import { NPC } from "src/engine/objects";
import GameData from "src/engine/game-data";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { Cell } from "src/ui/components";

export const Events = {
	RequestRemoval: 'RequestRemoval'
};

class NPCComponent extends Cell<NPC> {
	public static readonly Events = Events;
	public static readonly TagName = "wf-zone-editor-npc";
	public gameData: GameData;
	public tileSheet: CSSTileSheet;
	public _npc: NPC;

	private _name: HTMLElement;
	private _position: HTMLElement;
	private _tile: HTMLElement;
	private _text: HTMLElement;
	private _remove: HTMLElement;

	constructor() {
		super();

		this._tile = document.createElement("div");
		this._tile.classList.add("tile");

		this._text = document.createElement("div");
		this._text.classList.add("text");

		this._name = document.createElement("div");
		this._name.classList.add("name");
		this._text.appendChild(this._name);

		this._position = document.createElement("div");
		this._position.classList.add("position");
		this._text.appendChild(this._position);

		this._remove = document.createElement('i');
		this._remove.classList.add('fa');
		this._remove.classList.add('fa-remove');
		this._remove.onclick = () => {
			const event = new CustomEvent(Events.RequestRemoval, { bubbles: true });
			this.dispatchEvent(event);
		}
		this._text.appendChild(this._remove);
	}

	connectedCallback() {
		this.appendChild(this._tile);
		this.appendChild(this._text);
	}

	cloneNode(deep?: boolean) {
		const node = <NPCComponent><any>super.cloneNode(deep);
		node.tileSheet = this.tileSheet;
		node.gameData = this.gameData;
		return node;
	}

	public set data(npc: NPC) {
		const char = npc.face;
		this._name.textContent = char.name;

		const frame = char.frames[0];
		const tile = frame.extensionRight || frame.down;
		this._tile.className = `tile ${this.tileSheet.cssClassNameForTile(tile.id)}`;

		this._position.textContent = `${npc.position.x}x${npc.position.y}`;
	}

	public get data() {
		return this._npc;
	}
}

export default NPCComponent;
