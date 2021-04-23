import "./game-speed-window.scss";

import { SettingsWindow } from "../ui";
import { Metronome } from "src/engine";

class GameSpeedWindow extends SettingsWindow {
	public static readonly tagName = "wf-game-speed-window";
	public metronome: Metronome = null;

	constructor() {
		super();
		this.title = "Game Speed";
		this.key = "tickDuration";
		this.minLabel = "Slow";
		this.midLabel = "Normal";
		this.maxLabel = "Fast";
		this.slider.min = 155;
		this.slider.max = 90;
		this.slider.snapToIntegers = true;
	}

	public close(): void {
		if (this.metronome) {
			this.metronome.tickDuration = this.slider.value;
		}

		super.close();
	}
}

export default GameSpeedWindow;
