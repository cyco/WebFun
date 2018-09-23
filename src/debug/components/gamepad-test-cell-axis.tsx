import { Component } from "src/ui";
import { Gamepad } from "src/std.gamepad";
import { ProgressBar } from "src/ui/components";
import "./gamepad-test-cell-axis.scss";

class GamepadTestCellAxis extends Component {
	public static readonly tagName = "wf-debug-gamepad-test-cell-axis";
	public gamepad: Gamepad;
	public axis: number;
	private _indicator: ProgressBar = <ProgressBar value={0} /> as ProgressBar;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._indicator);
		this.update();
	}

	public update(): void {
		this._indicator.value = this.gamepad.axes[this.axis];
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}
}

export default GamepadTestCellAxis;
