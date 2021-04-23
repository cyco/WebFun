import "./difficulty-window.scss";

import { SettingsWindow } from "../ui";

class DifficultyWindow extends SettingsWindow {
	public static readonly tagName = "wf-difficulty-window";

	constructor() {
		super();
		this.title = "Difficulty";
		this.key = "difficulty";
		this.minLabel = "Easy";
		this.midLabel = "Medium";
		this.maxLabel = "Hard";
		this.slider.min = 1;
		this.slider.max = 100;
		this.slider.snapToIntegers = true;
	}
}

export default DifficultyWindow;
