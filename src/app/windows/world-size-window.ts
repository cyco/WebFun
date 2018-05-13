import { SettingsWindow } from "../ui";
import "./world-size-window.scss";

class DifficultyWindow extends SettingsWindow {
	public static TagName = "wf-world-size-window";

	protected connectedCallback(): void {
		this.setAttribute("title", "World Size");
		this.setAttribute("key", "world-size");
		this.setAttribute("min-label", "Small");
		this.setAttribute("mid-label", "Medium");
		this.setAttribute("max-label", "Large");

		super.connectedCallback();
	}
}

export default DifficultyWindow;
