import { Component } from "src/ui";
import "./ammo.scss";

class Ammo extends Component {
	public static tagName = "wf-ammo";
	private _background: HTMLDivElement = <div className="background" /> as HTMLDivElement;
	private _indicator: HTMLDivElement = <div className="value" /> as HTMLDivElement;

	get ammo() {
		return parseInt(this._indicator.style.height) / 95 || 0;
	}

	set ammo(value: number) {
		let color = "";
		if (value === 0xff || value === -1) value = 0;
		else color = "#000000";

		this._background.style.backgroundColor = color;
		this._indicator.style.height = (value > 1 ? 1 : value) * 95 + "%";
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._background);
		this.appendChild(this._indicator);
	}
}

export default Ammo;
