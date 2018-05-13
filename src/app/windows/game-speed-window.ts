import { SettingsWindow } from "../ui";
import "./game-speed-window.scss";

class GameSpeedWindow extends SettingsWindow {
	public static tagName = "wf-game-speed-window";

	protected connectedCallback() {
		this.setAttribute("title", "Game Speed");
		this.setAttribute("key", "speed");
		this.setAttribute("min-label", "Slow");
		this.setAttribute("mid-label", "Normal");
		this.setAttribute("max-label", "Fast");

		super.connectedCallback();
	}
}

export default GameSpeedWindow;
