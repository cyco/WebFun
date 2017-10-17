import { Point } from "src/util";

export const Direction = {
	Up: 1 << 0,
	Down: 1 << 1,
	Left: 1 << 2,
	Right: 1 << 3
};

class InputManager {
	public mouseDownHandler: Function;
	public keyDownHandler: Function;
	protected _direction: number = 0;
	protected _drag: boolean = false;
	protected _attack: boolean = false;
	protected _walk: boolean = false;
	protected pause: boolean = false;
	protected locator: boolean = false;
	protected scrollDown: boolean = false;
	protected scrollUp: boolean = false;
	protected endDialog: boolean = false;
	protected pickUp: boolean = false;

	get directions() {
		return this._direction;
	}

	get walk() {
		return this._walk;
	}

	get drag() {
		return this._drag;
	}

	get attack() {
		return this._attack;
	}

	get mouseLocationInView() {
		return new Point(NaN, NaN);
	}
}

export default InputManager;
