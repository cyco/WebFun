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
	}
}

export default DifficultyWindow;
