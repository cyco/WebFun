import Component from "src/ui/component";
import "./search-bar.scss";

class SearchBar extends Component {
	public static readonly TagName = "wf-search-bar";
	public static readonly observedAttributes: string[] = [];

	public onclose: () => void;
	public onsearch: (search: string) => void;
	private _inputField: HTMLInputElement;
	private _button: HTMLButtonElement;

	constructor() {
		super();

		this._inputField = document.createElement("input");
		this._inputField.type = "search";
		this._inputField.oninput = () => this.onsearch && this.onsearch(this._inputField.value);
		this._button = document.createElement("button");
		this._button.textContent = "Done";
		this._button.onclick = () => this.onclose && this.onclose();
	}

	connectedCallback() {
		this.appendChild(this._inputField);
		this.appendChild(this._button);
	}

	disconnectedCallback() {
		this._inputField.remove();
		this._button.remove();
	}

	focus() {
		this._inputField.focus();
	}

	set searchString(s: string) {
		this._inputField.value = s;
	}

	get searchString() {
		return this._inputField.value;
	}

	get isVisible() {
		return this.hasAttribute("visible");
	}
}

export default SearchBar;
