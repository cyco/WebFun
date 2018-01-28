import "./npc.scss";
import { Component } from "src/ui";
import { NPC } from "src/engine/objects";
import { MutableNPC } from "src/engine/mutable-objects";
import GameData from "src/engine/game-data";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { Cell, Label, Selector } from "src/ui/components";
import { Point } from "src/util";

export const Events = {
	RequestRemoval: "RequestRemoval"
};

class NPCComponent extends Cell<NPC> {
	public static readonly Events = Events;
	public static readonly TagName = "wf-zone-editor-npc";
	public gameData: GameData;
	public tileSheet: CSSTileSheet;
	public _npc: NPC;

	private _name: Selector;
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

		this._name = <Selector>document.createElement(Selector.TagName);
		this._name.classList.add("name");
		this._name.onchange = () => {
			const mutableNPC = <MutableNPC>this._npc;
			mutableNPC.character = this.gameData.characters[+this._name.value];
			this._updateTilePreview();
		};
		this._name.borderless = true;
		this._text.appendChild(this._name);

		this._position = document.createElement(Label.TagName);
		this._position.classList.add("position");
		this._position.onchange = (e: Event) => {
			const [rawX, rawY] = this._position.innerText.split("x");
			const mutableNPC = <MutableNPC>this._npc;
			mutableNPC.position = new Point(parseInt(rawX), parseInt(rawY));
			this._updatePositionContents();
		};
		this._text.appendChild(this._position);

		this._remove = document.createElement("i");
		this._remove.classList.add("fa");
		this._remove.classList.add("fa-remove");
		this._remove.onclick = () => {
			const event = new CustomEvent(Events.RequestRemoval, { bubbles: true });
			this.dispatchEvent(event);
		};
		this._text.appendChild(this._remove);
	}

	connectedCallback() {
		this.appendChild(this._tile);
		this.appendChild(this._text);
	}

	cloneNode(deep?: boolean) {
		const node = <NPCComponent>(<any>super.cloneNode(deep));
		node.tileSheet = this.tileSheet;
		node.gameData = this.gameData;
		return node;
	}

	public set data(npc: NPC) {
		this._setupNameSelector();

		this._npc = npc;

		this._updateTilePreview();
		this._updatePositionContents();
	}

	private _updatePositionContents() {
		this._position.textContent = `${this._npc.position.x}x${this._npc.position.y}`;
	}

	private _updateTilePreview() {
		const char = this._npc.face;
		const frame = char.frames[0];
		const tile = frame.extensionRight || frame.down;
		this._tile.className = `tile ${this.tileSheet.cssClassNameForTile(tile.id)}`;
		this._name.value = `${char.id}`;
	}

	private _setupNameSelector() {
		this._name.removeAllOptions();
		this.gameData.characters.filter(c => c.isEnemy()).forEach(c => this._name.addOption(c.name, `${c.id}`));
	}

	public get data() {
		return this._npc;
	}
}

export default NPCComponent;
