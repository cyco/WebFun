import "./game-speed-window.scss";

import { SettingsWindow } from "../ui";

class GameSpeedWindow extends SettingsWindow {
	public static readonly tagName = "wf-game-speed-window";

	constructor() {
		super();
		this.title = "Game Speed";
		this.key = "speed";
		this.minLabel = "Slow";
		this.midLabel = "Normal";
		this.maxLabel = "Fast";
	}
}

export default GameSpeedWindow;
