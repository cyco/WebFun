import "./difficulty-window.scss";

import { SettingsWindow } from "../ui";

class DifficultyWindow extends SettingsWindow {
	public static readonly tagName = "wf-difficulty-window";
	public readonly title = "Difficulty";
	protected readonly key = "difficulty";
	protected readonly minLabel = "Easy";
	protected readonly midLabel = "Medium";
	protected readonly maxLabel = "Hard";
}

export default DifficultyWindow;
