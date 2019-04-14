import "./color-picker.scss";

import { Color } from "src/util";
import ColorWheel from "./color-wheel";
import { Component } from "src/ui";
import { Group } from "src/ui/components";

class ColorPicker extends Component {
	public static readonly tagName = "wf-color-picker";
	public static readonly observedAttributes: string[] = ["color"];

	private _color: Color = new Color(255, 255, 255, 1.0);

	private _wheel: ColorWheel;
	private _brightnessInput: HTMLInputElement;
	private _redInput: HTMLInputElement;
	private _greenInput: HTMLInputElement;
	private _blueInput: HTMLInputElement;
	private _rgbPreview: HTMLDivElement;

	constructor() {
		super();

		this._buildWheel();
		this._buildBrightnessSlider();
		this._buildRGBFields();
		this._buildColorPreview();
	}

	protected connectedCallback() {
		super.connectedCallback();
		const container = document.createElement(Group.tagName);
		container.appendChild(this._wheel);
		container.appendChild(this._brightnessInput);
		this.appendChild(container);

		this.appendChild(this._redInput.parentElement);
		this.appendChild(this._greenInput.parentElement);
		this.appendChild(this._blueInput.parentElement);

		this.appendChild(this._rgbPreview);

		this.color = this._color;
	}

	protected disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}

	private _buildColorPreview() {
		this._rgbPreview = document.createElement("div");
		this._rgbPreview.classList.add("preview");
	}

	private _buildWheel() {
		this._wheel = document.createElement(ColorWheel.tagName) as ColorWheel;
		this._wheel.style.height = "100px";
		this._wheel.style.width = "100px";
		this._wheel.onchange = () => {
			this.color = this._wheel.color;
			this.dispatchEvent(new CustomEvent("change"));
		};
	}

	private _buildBrightnessSlider() {
		this._brightnessInput = document.createElement("input");
		this._brightnessInput.type = "range";
		this._brightnessInput.min = "0";
		this._brightnessInput.max = "255";
		this._brightnessInput.onchange = _ => this._updateBrightness(+this._brightnessInput.value / 255.0);
		this._brightnessInput.oninput = _ => this._updateBrightness(+this._brightnessInput.value / 255.0);
	}

	private _updateBrightness(newValue: number) {
		this._wheel.adjustBrightness(newValue);
		this._color = new Color(this._wheel.color);
		this.updateState();
		this.dispatchEvent(new CustomEvent("change"));
	}

	private _buildRGBFields() {
		this._redInput = this._buildInput("R");
		this._greenInput = this._buildInput("G");
		this._blueInput = this._buildInput("B");
	}

	private _buildInput(label: string): HTMLInputElement {
		const labelElement = document.createElement("label");
		labelElement.appendChild(document.createTextNode(label));

		const input = document.createElement("input");
		input.type = "number";
		input.max = "255";
		input.min = "0";
		input.onchange = () => this._buildColorFromRGBs();
		labelElement.appendChild(input);
		return input;
	}

	private _buildColorFromRGBs() {
		this.color = `rgb(${this._redInput.value}, ${this._greenInput.value}, ${this._blueInput.value})`;
		this.dispatchEvent(new CustomEvent("change"));
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (attr === "color" && oldValue !== newValue) this.color = newValue;
	}

	private updateState() {
		const [r, g, b] = this._color.rgbComponents;
		this._redInput.value = `${r}`;
		this._greenInput.value = `${g}`;
		this._blueInput.value = `${b}`;
		this._rgbPreview.style.backgroundColor = `rgb(${r},${g},${b})`;
	}

	get color() {
		return this._color;
	}

	set color(c: string | Color) {
		this._color = new Color(c);

		const [, , v] = this._color.hsvComponents;
		this._brightnessInput.value = `${Math.round(v * 255)}`;
		this._wheel.setAttribute("color", `${this._color}`);

		this.updateState();
	}
}

export default ColorPicker;
