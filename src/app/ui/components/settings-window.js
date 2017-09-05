import { Button, Slider, Window } from "src/ui/components";
import "./settings-window.scss";

class SettingsWindow extends Window {
	static get TagName() {
		return "wf-settings-window";
	}

	static get observedAttributes() {
		return [ "title", "text", "key", "min-label", "mid-label", "max-label", "steps" ];
	}

	constructor() {
		super();

		this._store = null;
		this._minLabel = null;
		this._midLabel = null;
		this._maxLabel = null;
		this._slider = null;
		this._key = null;

		this.closable = false;

		this._setupContents();
	}

	_setupContents() {
		const slider = document.createElement(Slider.TagName);
		slider.min = 0;
		slider.value = 0.5;
		slider.max = 1;
		this.content.appendChild(slider);
		this._slider = slider;

		const labels = document.createElement("div");
		labels.style.justifyContent = "space-between";
		this._minLabel = document.createElement("label");
		labels.appendChild(this._minLabel);
		this._midLabel = document.createElement("label");
		labels.appendChild(this._midLabel);
		this._maxLabel = document.createElement("label");
		labels.appendChild(this._maxLabel);
		this.content.appendChild(labels);

		const buttons = document.createElement("div");
		buttons.style.justifyContent = "center";
		const okButton = document.createElement(Button.TagName);
		okButton.setAttribute("label", "OK");
		okButton.onclick = () => {
			this._storeValue();
			this.close();
		};
		buttons.appendChild(okButton);

		const cancelButton = document.createElement(Button.TagName);
		cancelButton.setAttribute("label", "Cancel");
		cancelButton.onclick = () => this.close();
		buttons.appendChild(cancelButton);
		this.content.appendChild(buttons);
	}

	_storeValue() {
		if (!this._key) return;
		localStorage.store(this._key, this._slider.value);
	}

	_updateValue() {
		if (!this._key) return;

		this._slider.value = localStorage.load(this._key);
	}

	attributeChangedCallback(attributeName, oldValue, newValue) {
		if (attributeName === "title") {
			this.title = newValue;
		}

		if (attributeName === "key") {
			this._key = newValue;
			this._updateValue();
		}

		if (attributeName === "min-label") {
			this._minLabel.textContent = newValue;
		}

		if (attributeName === "mid-label") {
			this._midLabel.textContent = newValue;
		}

		if (attributeName === "max-label") {
			this._maxLabel.textContent = newValue;
		}

		if (attributeName === "steps") {
			this._slider.steps = +newValue;
		}
	}
}

export default SettingsWindow;
