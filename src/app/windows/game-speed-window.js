import { SettingsWindow } from "/app/ui/components";
import "./game-speed-window.scss";

class GameSpeedWindow extends SettingsWindow {
	static get TagName() {
		return "wf-game-speed-window";
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute("title", "Game Speed");
		this.setAttribute("key", "speed");
		this.setAttribute("min-label", "Slow");
		this.setAttribute("mid-label", "Normal");
		this.setAttribute("max-label", "Fast");

		super.connectedCallback();
	}
}

export default GameSpeedWindow;
