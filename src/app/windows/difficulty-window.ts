import { SettingsWindow } from "../ui";
import "./difficulty-window.scss";

class DifficultyWindow extends SettingsWindow {
	public static tagName = "wf-difficulty-window";

	protected connectedCallback(): void {
		this.setAttribute("title", "Difficulty");
		this.setAttribute("key", "difficulty");
		this.setAttribute("min-label", "Easy");
		this.setAttribute("mid-label", "Medium");
		this.setAttribute("max-label", "Hard");

		super.connectedCallback();
	}
}

export default DifficultyWindow;
