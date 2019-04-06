import "./ammo.scss";

import { Component } from "src/ui";

class Ammo extends Component {
	public static readonly tagName = "wf-ammo";
	private _background: HTMLDivElement = <div className="background" /> as HTMLDivElement;
	private _indicator: HTMLDivElement = <div className="value" /> as HTMLDivElement;
	private _value: number = -1;

	get ammo() {
		return this._value;
	}

	set ammo(value: number) {
		let color = "";
		if (value === 0xff || value === -1) value = 0;
		else color = "#000000";

		this._background.style.backgroundColor = color;
		this._indicator.style.height = (value > 1 ? 1 : value) * 94 + "%";
		this._value = value;
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._background);
		this.appendChild(this._indicator);

		this.ammo = this.ammo;
	}
}

export default Ammo;
