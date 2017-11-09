import { Cell } from "src/ui/components";
import { Zone } from "src/engine/objects";
import "./zone-inspector-cell.scss";

class ZoneInspectorCell extends Cell<Zone> {
	public static readonly TagName: string = "wf-zone-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	private _icon: HTMLElement;
	private _id: HTMLElement;
	private _type: HTMLElement;
	private _planet: HTMLElement;
	private _size: HTMLElement;

	constructor() {
		super();
		this._icon = document.createElement("div");
		this._icon.classList.add("icon");
		this._id = document.createElement("span");
		this._id.classList.add("id");
		this._type = document.createElement("span");
		this._type.classList.add("type");
		this._size = document.createElement("span");
		this._size.classList.add("size");
		this._planet = document.createElement("span");
		this._planet.classList.add("planet");
	}

	connectedCallback() {
		this._id.textContent = `${this.data.id}`;
		this._size.textContent = `${this.data.size.width}x${this.data.size.height}`;
		this._type.textContent = this.data.type.name;
		this._planet.textContent = this.data.planet.name;

		this.appendChild(this._icon);
		const content = document.createElement("div");
		content.classList.add("content");
		content.appendChild(this._id);
		content.appendChild(this._type);
		content.appendChild(this._planet);
		content.appendChild(this._size);
		this.appendChild(content);
	}

	disconnectedCallback() {
		this.textContent = "";

		this._icon.remove();
		this._id.remove();
		this._type.remove();
		this._planet.remove();
		this._size.remove();
	}
}

export default ZoneInspectorCell;
