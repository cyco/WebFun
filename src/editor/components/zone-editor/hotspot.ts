import "./npc.scss";
import { Component } from "src/ui";
import { Hotspot } from "src/engine/objects";
import { MutableHotspot } from "src/engine/mutable-objects";
import GameData from "src/engine/game-data";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { Cell, Label, Selector } from "src/ui/components";
import { Point } from "src/util";

export const Events = {
	RequestRemoval: "RequestRemoval"
};

class HotspotComponent extends Cell<Hotspot> {
	public static readonly Events = Events;
	public static readonly TagName = "wf-zone-editor-hotspot";
	public gameData: GameData;
	public tileSheet: CSSTileSheet;
	public _hotspot: Hotspot;

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
			const mutableHotspot = <MutableHotspot>this._hotspot;
			mutableHotspot.type = Hotspot.Type.fromNumber(+this._name.value);
			this._updateTilePreview();
		};
		this._name.borderless = true;
		this._text.appendChild(this._name);

		this._position = document.createElement(Label.TagName);
		this._position.classList.add("position");
		this._position.onchange = (e: Event) => {
			const [rawX, rawY] = this._position.innerText.split("x");
			const mutableHotspot = <MutableHotspot>this._hotspot;
			mutableHotspot.x = parseInt(rawX);
			mutableHotspot.y = parseInt(rawY);
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

	protected connectedCallback() {
		this.appendChild(this._tile);
		this.appendChild(this._text);
	}

	cloneNode(deep?: boolean) {
		const node = <HotspotComponent>(<any>super.cloneNode(deep));
		node.tileSheet = this.tileSheet;
		node.gameData = this.gameData;
		return node;
	}

	public set data(hotspot: Hotspot) {
		this._setupNameSelector();

		this._hotspot = hotspot;

		this._updateTilePreview();
		this._updatePositionContents();
	}

	private _updatePositionContents() {
		this._position.textContent = `${this._hotspot.x}x${this._hotspot.y}`;
	}

	private _updateTilePreview() {
		this._name.value = `${this.data.type.rawValue}`;
	}

	private _setupNameSelector() {
		this._name.removeAllOptions();
		Hotspot.Type.knownTypes
			.filter(c => c)
			.forEach(c => this._name.addOption(c.name, `${c.rawValue}`));
	}

	public get data() {
		return this._hotspot;
	}
}

export default HotspotComponent;
