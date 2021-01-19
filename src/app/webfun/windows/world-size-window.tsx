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
	}
}

export default WordSizeWindow;
