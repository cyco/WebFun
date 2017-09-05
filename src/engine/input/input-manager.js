import { Point } from "src/util";

export const Direction = {
	Up: 1 << 0,
	Down: 1 << 1,
	Left: 1 << 2,
	Right: 1 << 3
};

export default class InputManager {
	constructor() {
		this._direction = 0;
		this._drag = false;
		this._attack = false;
		this._walk = false;
		this.pause = false;
		this.locator = false;

		this.scrollDown = false;
		this.scrollUp = false;
		this.endDialog = false;
		this.pickUp = false;

		this.mouseDownHandler = null;
		this.keyDownHandler = null;
	}

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
