import Component from "src/ui/component";
import "./search-bar.scss";

class SearchBar extends Component {
	public static readonly TagName = "wf-search-bar";
	public static readonly observedAttributes: string[] = [];

	public onclose: () => void;
	private _inputField: HTMLInputElement;
	private _button: HTMLButtonElement;

	constructor() {
		super();

		this._inputField = document.createElement("input");
		this._inputField.type = "search";

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
}

export default SearchBar;
