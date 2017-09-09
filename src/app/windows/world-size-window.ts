import { SettingsWindow } from "src/app/ui/components";
import "./world-size-window.scss";

class DifficultyWindow extends SettingsWindow {
	public static TagName = "wf-world-size-window";

	connectedCallback(): void {
		this.setAttribute("title", "World Size");
		this.setAttribute("key", "world-size");
		this.setAttribute("min-label", "Small");
		this.setAttribute("mid-label", "Medium");
		this.setAttribute("max-label", "Large");

		super.connectedCallback();
	}
}

export default DifficultyWindow;
