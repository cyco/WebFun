import "./game-speed-window.scss";

import { SettingsWindow } from "../ui";

class GameSpeedWindow extends SettingsWindow {
	public static readonly tagName = "wf-game-speed-window";
	public readonly title = "Game Speed";
	protected readonly key = "speed";
	protected minLabel = "Slow";
	protected midLabel = "Normal";
	protected maxLabel = "Fast";
}

export default GameSpeedWindow;
