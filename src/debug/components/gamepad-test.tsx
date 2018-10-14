import { Component } from "src/ui";
import { List } from "src/ui/components";
import { Gamepad, GamepadEvent, Events } from "src/std/gamepad";
import GamepadTestCell from "./gamepad-test-cell";
import "./gamepad-test.scss";

class GamepadTest extends Component implements EventListenerObject {
	public static readonly tagName = "wf-debug-gamepad-test";
	private _pads: Gamepad[] = Array.from(navigator.getGamepads()) || [];

	private _list = <List cell={<GamepadTestCell />} items={this._pads.map((p, idx) => [p, idx])} /> as List<
		[Gamepad, number]
	>;

	public connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._list);

		window.addEventListener(Events.GamepadConnected, this);
		window.addEventListener(Events.GamepadDisconnected, this);
	}

	public handleEvent(e: GamepadEvent) {
		console.log("event", e, e.gamepad);
		this._pads.push(e.gamepad);
		this._list.items = this._pads.map((p, idx) => [p, idx] as [Gamepad, number]);
	}

	public disconnectedCallback() {
		this._list.remove();

		window.removeEventListener(Events.GamepadConnected, this);
		window.removeEventListener(Events.GamepadDisconnected, this);

		super.disconnectedCallback();
	}
}

export default GamepadTest;
