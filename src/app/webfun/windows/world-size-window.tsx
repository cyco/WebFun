import "./world-size-window.scss";

import { SettingsWindow } from "../ui";

class WordSizeWindow extends SettingsWindow {
	public static readonly tagName = "wf-world-size-window";

	constructor() {
		super();

		this.title = "World Size";
		this.key = "world-size";
		this.minLabel = "Small";
		this.midLabel = "Medium";
		this.maxLabel = "Large";
		this.slider.min = 1;
		this.slider.max = 3;
		this.slider.snapToIntegers = true;
	}
}

export default WordSizeWindow;
