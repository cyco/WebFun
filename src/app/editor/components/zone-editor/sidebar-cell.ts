import "./sidebar-cell.scss";

import Component from "src/ui/component";
import ExpandButton from "src/app/editor/components/expand-button";
import { IconButton } from "src/ui/components";

class SidebarCell extends Component {
	static readonly tagName = "wf-zone-editor-sidebar-cell";
	public expanded: boolean;
	protected _state: Storage;
	public content: void;
	protected _header: HTMLElement;
	protected _expandButton: ExpandButton;
	protected _newButton: IconButton;
	private _newItemCallback: () => void;

	constructor() {
		super();

		this._header = document.createElement("header");
		this._header.appendChild(document.createElement("span"));

		this._expandButton = document.createElement(ExpandButton.tagName) as ExpandButton;
		this._expandButton.element = this;
		this._expandButton.ontoggle = () =>
			this._state.store("expanded", this.classList.contains("expanded"));
		this._header.appendChild(this._expandButton);

		this._newButton = document.createElement(IconButton.tagName) as IconButton;
		this._newButton.icon = "plus-circle";
		this._newButton.style.display = "none";
		this._newButton.onclick = () => this.newItemCallback();
		this._header.appendChild(this._newButton);
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.insertBefore(this._header, this.firstElementChild);
	}

	protected disconnectedCallback(): void {
		this._header.remove();
		super.disconnectedCallback();
	}

	public set name(name: string) {
		this._header.firstElementChild.textContent = name;
	}

	public get name(): string {
		return this._header.firstElementChild.textContent;
	}

	public set state(state: Storage) {
		this._state = state;

		if (state.load("expanded")) {
			this._expandButton.expand();
		}
	}

	public get state(): Storage {
		return this._state;
	}

	public clear(): void {
		this.textContent = "";
		this.appendChild(this._header);
	}

	set newItemCallback(thing: () => void) {
		this._newItemCallback = thing;
		this._newButton.style.display = thing ? "" : "none";
	}

	get newItemCallback(): () => void {
		return this._newItemCallback;
	}
}

export default SidebarCell;
