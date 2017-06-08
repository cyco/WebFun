import Component from "../component";
import "./checkbox.scss";

export default class Checkbox extends Component {
	static get TagName(){
		return 'wf-checkbox';
	}
	
	constructor() {
		super();
		
		const boxID = String.UUID();

		const box = document.createElement("input");
		box.type = "checkbox";
		box.id = boxID;
		this._box = box;

		const label = document.createElement("label");
		label.append();
		label.setAttribute("for", boxID);
		this._label = label;
	}
	
	connectedCallback(){
		super.connectedCallback();
		
		this.appendChild(this._box);
		this.appendChild(this._label);
	}
	
	disconnectedCallback(){
		this.clear();
		
		super.disconnectedCallback();
	}

	get title() {
		return this._label.textContent;
	}

	set title(t) {
		this._label.clear();
		this._label.append(t);
	}

	get checked() {
		return this._box.checked;
	}
	
	set checked(c) {
		this._box.checked = c;
	}

	set onchange(f) {
		this._box.onchange = f;
	}
	get onchange() {
		return this._box.onchange;
	}
}
