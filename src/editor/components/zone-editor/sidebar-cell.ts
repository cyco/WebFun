import Component from "src/ui/component";
import ExpandButton from "src/editor/components/expand-button";
import { IconButton } from "src/ui/components";
import "./sidebar-cell.scss";

class SidebarCell extends Component {
	static readonly TagName: string = "wf-zone-editor-sidebar-cell";
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

		this._expandButton = <ExpandButton>document.createElement(ExpandButton.TagName);
		this._expandButton.element = this;
		this._expandButton.ontoggle = () => this._state.store("expanded", this.classList.contains("expanded"));
		this._header.appendChild(this._expandButton);

		this._newButton = <IconButton>document.createElement(IconButton.TagName);
		this._newButton.icon = "plus-circle";
		this._newButton.style.display = "none";
		this._newButton.onclick = () => this.newItemCallback();
		this._header.appendChild(this._newButton);
	}

	connectedCallback() {
		super.connectedCallback();
		this.insertBefore(this._header, this.firstElementChild);
	}

	disconnectedCallback() {
		this._header.remove();
		super.disconnectedCallback();
	}

	public set name(name: string) {
		this._header.firstElementChild.textContent = name;
	}

	public get name() {
		return this._header.firstElementChild.textContent;
	}

	public set state(state) {
		this._state = state;

		if (state.load("expanded")) {
			this._expandButton.expand();
		}
	}

	public get state() {
		return this._state;
	}

	clear() {
		this.textContent = "";
		this.appendChild(this._header);
	}

	set newItemCallback(thing) {
		this._newItemCallback = thing;
		this._newButton.style.display = thing ? "" : "none";
	}

	get newItemCallback() {
		return this._newItemCallback;
	}
}

export default SidebarCell;
