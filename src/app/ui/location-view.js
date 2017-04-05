import { View } from "/ui";

const LocationSVG = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"46\" width=\"46\"><g><polygon class=\"right\" points=\"9.333333,11.25 14,11.25 14,3.75 9.333333,3.75 9.333333,0 0,7.5 9.333333,15 \" transform=\"matrix(-1,0,0,1,46,15.5)\"/><path class=\"dark\" d=\"M 36.161105,15.5 45.494438,23\"/><path d=\"m 45.494438,23 -9.333333,7.5\"/><path class=\"dark\" d=\"m 36.161105,30.5 0,-3.75\"/><path d=\"m 36.161105,26.75 -4.666667,0\"/><path d=\"m 31.494438,26.75 0,-7.5\" class=\"dark\"/><path class=\"dark\" d=\"m 31.494438,19.25 4.666667,0\"/><path class=\"dark\" d=\"m 36.161105,19.25 0,-3.75\"/></g><g transform=\"matrix(0,1,-1,0,46,-9.8257772e-8)\"><polygon class=\"down\" transform=\"matrix(-1,0,0,1,46,15.5)\" points=\"14,11.25 14,3.75 9.333333,3.75 9.333333,0 0,7.5 9.333333,15 9.333333,11.25 \"/><path d=\"M 36.161105,15.5 45.494438,23\"/><path d=\"m 45.494438,23 -9.333333,7.5\" class=\"dark\"/><path class=\"dark\" d=\"m 36.161105,30.5 0,-3.75\"/><path d=\"m 36.161105,26.75 -4.666667,0\" class=\"dark\"/><path class=\"dark\" d=\"m 31.494438,26.75 0,-7.5\"/><path d=\"m 31.494438,19.25 4.666667,0\"/><path class=\"dark\" d=\"m 36.161105,19.25 0,-3.75\"/></g><g transform=\"matrix(-1,0,0,-1,46,46)\"><polygon class=\"left\" points=\"9.333333,3.75 9.333333,0 0,7.5 9.333333,15 9.333333,11.25 14,11.25 14,3.75 \" transform=\"matrix(-1,0,0,1,46,15.5)\"/><path class=\"dark\" d=\"M 36.161105,15.5 45.494438,23\"/><path d=\"m 45.494438,23 -9.333333,7.5\" class=\"dark\"/><path d=\"m 36.161105,30.5 0,-3.75\"/><path class=\"dark\" d=\"m 36.161105,26.75 -4.666667,0\"/><path d=\"m 31.494438,26.75 0,-7.5\"/><path d=\"m 31.494438,19.25 4.666667,0\"/><path d=\"m 36.161105,19.25 0,-3.75\"/></g><g transform=\"matrix(0,-1,1,0,0,46)\"><polygon class=\"up\" transform=\"matrix(-1,0,0,1,46,15.5)\" points=\"9.333333,15 9.333333,11.25 14,11.25 14,3.75 9.333333,3.75 9.333333,0 0,7.5 \"/><path d=\"M 36.161105,15.5 45.494438,23\" class=\"dark\"/><path d=\"m 45.494438,23 -9.333333,7.5\" class=\"dark\"/><path d=\"m 36.161105,30.5 0,-3.75\"/><path d=\"m 36.161105,26.75 -4.666667,0\"/><path d=\"m 31.494438,26.75 0,-7.5\"/><path d=\"m 31.494438,19.25 4.666667,0\" class=\"dark\"/><path d=\"m 36.161105,19.25 0,-3.75\"/></g></svg>";

export default class WeaponView extends View {
	constructor(element) {
		super(element);

		this.element.classList.add("location-view");
		this.element.innerHTML = LocationSVG;

		this._svg = this.element.querySelector("svg");

		Object.seal(this);
	}

	set left(flag) {
		this._setClass(flag, "left");
	}

	get left() {
		return this._svg.classList.contains("left");
	}

	set right(flag) {
		this._setClass(flag, "right");
	}

	get right() {
		return this._svg.classList.contains("right");
	}

	set up(flag) {
		this._setClass(flag, "up");
	}

	get up() {
		return this._svg.classList.contains("up");
	}

	set down(flag) {
		this._setClass(flag, "down");
	}

	get down() {
		return this._svg.classList.contains("down");
	}

	_setClass(flag, c) {
		if (flag) {
			this._svg.classList.add(c);
		} else {
			this._svg.classList.remove(c);
		}
	}
}
