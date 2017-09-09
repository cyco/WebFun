import "./ammo.scss";
import { Component } from "src/ui";

export default class extends Component {
	public static TagName = 'wf-ammo';
	private _background: HTMLDivElement;
	private _indicator: HTMLDivElement;

	constructor() {
		super();

		const background = document.createElement("div");
		background.classList.add("background");
		this._background = background;

		this._indicator = document.createElement("div");
		this._indicator.classList.add("value");
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._background);
		this.appendChild(this._indicator);
	}

	get ammo() {
		return parseInt(this._indicator.style.height) / 95 || 0;
	}

	set ammo(value: number) {
		let color = "";
		if (value === 0xFF || value === -1) value = 0;
		else color = "#000000";

		this._background.style.backgroundColor = color;
		this._indicator.style.height = ((value > 1 ? 1 : value) * 95) + "%";
	}
}
