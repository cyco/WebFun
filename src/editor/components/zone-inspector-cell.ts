import { Cell } from "src/ui/components";
import { Zone, ZoneType } from "src/engine/objects";
import "./zone-inspector-cell.scss";
import CSSTileSheet from "../css-tile-sheet";

const Events = {
	RevealReferences: "RevealReferences",
	RemoveZone: "RemoveZone"
};

class ZoneInspectorCell extends Cell<Zone> {
	public static readonly Events = Events;
	public static readonly tagName: string = "wf-zone-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public tileSheet: CSSTileSheet;
	private _icon: HTMLElement;
	private _id: HTMLElement;
	private _type: HTMLElement;
	private _planet: HTMLElement;
	private _actions: HTMLElement;
	private _size: HTMLElement;

	constructor() {
		super();
		this._icon = document.createElement("div");
		this._icon.classList.add("icon");
		this._id = document.createElement("span");
		this._id.classList.add("id");
		this._type = document.createElement("span");
		this._size = document.createElement("span");
		this._size.classList.add("size");
		this._actions = document.createElement("span");
		const revealButton = document.createElement("i");
		revealButton.className = "fa fa-search";
		revealButton.onclick = e => {
			this.dispatchEvent(
				new CustomEvent(Events.RevealReferences, {
					detail: { zone: this.data },
					bubbles: true
				})
			);
			e.preventDefault();
			e.stopPropagation();
		};
		this._actions.appendChild(revealButton);
		const deleteButton = document.createElement("i");
		deleteButton.className = "fa fa-remove";
		deleteButton.onclick = e => {
			this.dispatchEvent(
				new CustomEvent(Events.RemoveZone, {
					detail: { zone: this.data },
					bubbles: true
				})
			);
			e.preventDefault();
			e.stopPropagation();
		};
		this._actions.appendChild(deleteButton);
		this._planet = document.createElement("span");
		this._planet.classList.add("planet");
	}

	protected connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this._size.textContent = `${this.data.size.width}x${this.data.size.height}`;
		this._type.textContent = this.data.hasTeleporter ? "Teleporter" : this.data.type.name;
		this._planet.textContent = this.data.planet.name;

		const classes = this._cssClassesForIcon(this.data.type);
		this._icon.className = "icon" + (classes ? " " + classes.join(" ") : "");

		this.appendChild(this._icon);
		const content = document.createElement("div");
		content.classList.add("content");
		content.appendChild(this._id);
		content.appendChild(this._type);
		content.appendChild(this._planet);
		content.appendChild(this._actions);
		content.appendChild(this._size);
		this.appendChild(content);
	}

	private _cssClassesForIcon(zoneType: ZoneType) {
		const tileId = this.tileIdForZoneType(zoneType);
		if (tileId === -1) return [];

		return this.tileSheet.cssClassesForTile(tileId);
	}

	private tileIdForZoneType(zoneType: ZoneType) {
		switch (zoneType) {
			case ZoneType.Town:
				return 829;
			case ZoneType.Goal:
				return 830;
			case ZoneType.BlockadeWest:
				return 827;
			case ZoneType.BlockadeEast:
				return 823;
			case ZoneType.BlockadeNorth:
				return 821;
			case ZoneType.BlockadeSouth:
				return 825;
			case ZoneType.Find:
			case ZoneType.FindTheForce:
			case ZoneType.Trade:
			case ZoneType.Use:
				return 818;
			case ZoneType.TravelStart:
			case ZoneType.TravelEnd:
				return 820;
			case ZoneType.Empty:
				if (this.data.hasTeleporter) return 834;
				return 832;
			case ZoneType.Room:
				return 835;
			case ZoneType.None:
			case ZoneType.Load:
			case ZoneType.Unknown:
				return 836;
		}
		return -1;
	}

	public cloneNode(deep?: boolean): ZoneInspectorCell {
		const node = <ZoneInspectorCell>super.cloneNode(deep);
		node.tileSheet = this.tileSheet;
		node.onclick = this.onclick;
		return node;
	}

	protected disconnectedCallback() {
		this.textContent = "";

		this._icon.remove();
		this._id.remove();
		this._type.remove();
		this._planet.remove();
		this._size.remove();
	}
}

export default ZoneInspectorCell;
