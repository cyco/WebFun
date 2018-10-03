import { Component } from "src/ui";
import { Cell } from "src/ui/components";
import { Gamepad } from "src/std/gamepad";
import GamepadTestCellButton from "./gamepad-test-cell-button";
import GamepadTestCellAxis from "./gamepad-test-cell-axis";

import "./gamepad-test-cell.scss";

const UPDATE_INTERVAL = 50;

class GamepadTestCell extends Cell<[Gamepad, number]> {
	public static tagName = "wf-debug-gamepad-test-cell";
	private _gamepadIdx: number;
	private _gamepad: Gamepad;
	private timer: any;

	connectedCallback() {
		super.connectedCallback();
		this.timer = window.setInterval(() => this.update(), UPDATE_INTERVAL);
	}

	private update() {
		navigator.getGamepads();

		const nodes = this.querySelectorAll(
			GamepadTestCellAxis.tagName + "," + GamepadTestCellButton.tagName
		) as NodeListOf<GamepadTestCellButton | GamepadTestCellAxis>;
		nodes.forEach(node => node.update());
	}

	disconnectedCallback() {
		window.clearInterval(this.timer);
		super.disconnectedCallback();
	}

	set data(pad: [Gamepad, number]) {
		if (!pad[0]) return;

		this._gamepadIdx = pad[1];
		this._gamepad = pad[0];
		this.textContent = "";

		this.appendChild(
			<div>
				<div className="info">
					[{this._gamepad.index.toString()}] {this._gamepad.id}
				</div>
				<div className="axes">
					{this._gamepad.axes.map((_, idx) => (
						<GamepadTestCellAxis gamepad={this._gamepad} axis={idx} />
					))}
				</div>
				<div className="buttons">
					{this._gamepad.buttons.map((button, idx) => (
						<GamepadTestCellButton gamepad={this._gamepad} buttonIdx={idx} button={button} />
					))}
				</div>
			</div>
		);
	}

	get data() {
		return [this._gamepad, this._gamepadIdx];
	}
}

export default GamepadTestCell;
