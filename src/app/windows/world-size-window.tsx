import { SettingsWindow } from "../ui";
import "./world-size-window.scss";

class DifficultyWindow extends SettingsWindow {
	public static readonly tagName = "wf-world-size-window";
	public readonly title = "World Size";
	protected readonly key = "world-size";
	protected readonly minLabel = "Small";
	protected readonly midLabel = "Medium";
	protected readonly maxLabel = "Large";
}

export default DifficultyWindow;