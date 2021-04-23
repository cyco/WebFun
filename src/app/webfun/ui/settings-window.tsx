import "./settings-window.scss";

import { AbstractWindow, Button, Slider } from "src/ui/components";

abstract class SettingsWindow extends AbstractWindow {
	private _minLabel: HTMLLabelElement = (<label />) as HTMLLabelElement;
	private _midLabel: HTMLLabelElement = (<label />) as HTMLLabelElement;
	private _maxLabel: HTMLLabelElement = (<label />) as HTMLLabelElement;
	private _slider: Slider = (<Slider min={0} value={0.5} max={1} />) as Slider;
	private _key: string;
	public store: Storage = localStorage;

	constructor() {
		super();

		this.closable = false;
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

	protected connectedCallback(): void {
		super.connectedCallback();

		this._updateValue();
	}

	private _storeValue() {
		if (!this._key) return;
		this.store.store(`settings.${this._key}`, this._slider.value);
	}

	private _updateValue() {
		if (!this._key) return;
		this._slider.value = this.store.load(`settings.${this._key}`);
	}

	protected set steps(s: number) {
		this._slider.steps = s;
	}

	protected get steps(): number {
		return this._slider.steps;
	}

	protected set key(m: string) {
		this._key = m;
		this._updateValue();
	}

	protected get key(): string {
		return this._key;
	}

	protected set minLabel(m: string) {
		this._minLabel.textContent = m;
	}

	protected get minLabel(): string {
		return this._minLabel.textContent;
	}

	protected set midLabel(m: string) {
		this._midLabel.textContent = m;
	}

	protected get midLabel(): string {
		return this._midLabel.textContent;
	}

	protected set maxLabel(m: string) {
		this._maxLabel.textContent = m;
	}

	protected get maxLabel(): string {
		return this._maxLabel.textContent;
	}

	protected get slider(): Slider {
		return this._slider;
	}
}

export default SettingsWindow;
