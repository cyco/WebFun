import { Component } from "src/ui";
import { ProgressBar } from "src/ui/components";
import { Gamepad, GamepadButton } from "src/std.gamepad";
import "./gamepad-test-cell-button.scss";

class GamepadTestCellButton extends Component {
	public static readonly tagName = "wf-debug-gamepad-test-cell-button";
	public button: GamepadButton;
	public buttonIdx: number;
	public gamepad: Gamepad;

	private indicator = <ProgressBar value={0} /> as ProgressBar;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this.indicator);
		this.update();
	}

	public update(): void {
		this.indicator.value = this.button.value;
		// this.indicator.value = this.gamepad.buttons[this.buttonIdx].value;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}
}

export default GamepadTestCellButton;
