import Component from "src/ui/component";
import ExpandButton from "src/editor/components/expand-button";
import "./sidebar-cell.scss";

class SidebarCell extends Component {
	static readonly TagName: string = "wf-zone-editor-sidebar-cell";
	public expanded: boolean;
	protected _state: Storage;
	public content: void;
	protected _header: HTMLElement;
	protected _expandButton: ExpandButton;

	constructor() {
		super();

		this._header = document.createElement("header");
		this._header.appendChild(document.createElement("span"));
		this._expandButton = <ExpandButton>document.createElement(ExpandButton.TagName);
		this._expandButton.element = this;
		this._expandButton.ontoggle = () => this._state.store("expanded", this.classList.contains("expanded"));
		this._header.appendChild(this._expandButton);
	}

	connectedCallback() {
		super.connectedCallback();
		this.insertBefore(this._header, this.firstElementChild);
	}

	disconnectedCallback() {
		this._header.remove();
		super.disconnectedCallback();
	}

	public set label(label: string) {
		this._header.firstElementChild.textContent = label;
	}

	public get label() {
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
}

export default SidebarCell;
