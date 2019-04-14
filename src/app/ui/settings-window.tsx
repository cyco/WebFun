import "./settings-window.scss";

import { AbstractWindow, Button, Slider } from "src/ui/components";

abstract class SettingsWindow extends AbstractWindow {
	public closable = false;
	private _minLabel: HTMLLabelElement = <label /> as HTMLLabelElement;
	private _midLabel: HTMLLabelElement = <label /> as HTMLLabelElement;
	private _maxLabel: HTMLLabelElement = <label /> as HTMLLabelElement;
	private _slider: Slider = <Slider min={0} value={0.5} max={1} /> as Slider;
	private _key: string;

	constructor() {
		super();

		this.content.appendChild(this._slider);
		this.content.appendChild(
			<div style={{ justifyContent: "space-between" }}>
				{[this._minLabel, this._midLabel, this._maxLabel]}
			</div>
		);
		this.content.appendChild(
			<div style={{ justifyContent: "center" }}>
				<Button
					label="OK"
					onclick={() => {
						this._storeValue();
						this.close();
					}}
				/>
				<Button
					label="Cancel"
					onclick={() => {
						this._storeValue();
						this.close();
					}}
				/>
			</div>
		);
	}

	private _storeValue() {
		if (!this._key) return;
		localStorage.store(this._key, this._slider.value);
	}

	private _updateValue() {
		if (!this._key) return;
		this._slider.value = localStorage.load(this._key);
	}

	protected set steps(s) {
		this._slider.steps = s;
	}

	protected get steps() {
		return this._slider.steps;
	}

	protected set key(m) {
		this._key = m;
		this._updateValue();
	}

	protected get key() {
		return this._key;
	}

	protected set minLabel(m) {
		this._minLabel.textContent = m;
	}

	protected get minLabel() {
		return this._minLabel.textContent;
	}

	protected set midLabel(m) {
		this._midLabel.textContent = m;
	}

	protected get midLabel() {
		return this._midLabel.textContent;
	}

	protected set maxLabel(m) {
		this._maxLabel.textContent = m;
	}

	protected get maxLabel() {
		return this._maxLabel.textContent;
	}
}

export default SettingsWindow;
