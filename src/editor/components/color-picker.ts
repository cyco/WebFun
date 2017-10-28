import { Component } from "src/ui";

class ColorPicker extends Component {
	public static readonly TagName = "wf-color-picker";
	public static readonly observedAttributes: string[] = [];

	private _gradient = document.createElement("div");
	private _highlighter = document.createElement("highligher");

	connectedCallback() {
		this._highlighter.classList.add("highlighter");
		this._gradient.classList.add("gradient");

		this.appendChild(this._gradient);
	}
}

export default ColorPicker;
