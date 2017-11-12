import "./sidebar-layer.scss";
import Cell from "src/ui/components/cell";
import Layer from "./layer";

export const Event = {
	DidToggleVisibility: "DidToggleVisibility",
	DidToggleLock: "DidToggleLock"
};

class SidebarLayer extends Cell<Layer> {
	static readonly Event = Event;
	static readonly TagName = "wf-zone-editor-sidebar-layer";

	private _name: HTMLElement;
	private _visible: HTMLElement;
	private _locked: HTMLElement;

	constructor() {
		super();

		this._name = document.createElement("span");

		this._visible = document.createElement("i");
		this._visible.onclick = () => {
			this.data.visible = !this.data.visible;
			this.dispatchEvent(new CustomEvent(Event.DidToggleVisibility, {detail: {layer: this.data}, bubbles: true}));
			this.rebuild();
		};

		this._locked = document.createElement("i");
		this._locked.onclick = () => {
			this.dispatchEvent(new CustomEvent(Event.DidToggleLock, {detail: {layer: this.data}, bubbles: true}));
			this.data.locked = !this.data.locked;
			this.rebuild();
		};
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._name);
		this.appendChild(this._visible);
		this.appendChild(this._locked);

		this.rebuild();
	}

	private rebuild() {
		this._name.textContent = this.data.name;

		this._visible.className = "fa";
		if (this.data.visible) this._visible.classList.add("fa-eye");
		else this._visible.classList.add("fa-eye-slash");

		this._locked.className = "fa";
		if (this.data.locked) this._locked.classList.add("fa-lock");
		else this._locked.classList.add("fa-unlock-alt");
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.textContent = "";
	}
}

export default SidebarLayer;
