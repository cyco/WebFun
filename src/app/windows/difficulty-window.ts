import { SettingsWindow } from "src/app/ui/components";
import "./difficulty-window.scss";

class DifficultyWindow extends SettingsWindow {
	public static TagName = "wf-difficulty-window";

	connectedCallback(): void {
		this.setAttribute("title", "Difficulty");
		this.setAttribute("key", "difficulty");
		this.setAttribute("min-label", "Easy");
		this.setAttribute("mid-label", "Medium");
		this.setAttribute("max-label", "Hard");

		super.connectedCallback();
	}
}

export default DifficultyWindow;
