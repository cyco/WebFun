import { Component } from "src/ui";
import "./location.scss";

const LocationSVG =
	'<svg xmlns="http://www.w3.org/2000/svg" height="46" width="46"><g><polygon class="right" points="9.333333,11.25 14,11.25 14,3.75 9.333333,3.75 9.333333,0 0,7.5 9.333333,15 " transform="matrix(-1,0,0,1,46,15.5)"/><path class="dark" d="M 36.161105,15.5 45.494438,23"/><path d="m 45.494438,23 -9.333333,7.5"/><path class="dark" d="m 36.161105,30.5 0,-3.75"/><path d="m 36.161105,26.75 -4.666667,0"/><path d="m 31.494438,26.75 0,-7.5" class="dark"/><path class="dark" d="m 31.494438,19.25 4.666667,0"/><path class="dark" d="m 36.161105,19.25 0,-3.75"/></g><g transform="matrix(0,1,-1,0,46,-9.8257772e-8)"><polygon class="down" transform="matrix(-1,0,0,1,46,15.5)" points="14,11.25 14,3.75 9.333333,3.75 9.333333,0 0,7.5 9.333333,15 9.333333,11.25 "/><path d="M 36.161105,15.5 45.494438,23"/><path d="m 45.494438,23 -9.333333,7.5" class="dark"/><path class="dark" d="m 36.161105,30.5 0,-3.75"/><path d="m 36.161105,26.75 -4.666667,0" class="dark"/><path class="dark" d="m 31.494438,26.75 0,-7.5"/><path d="m 31.494438,19.25 4.666667,0"/><path class="dark" d="m 36.161105,19.25 0,-3.75"/></g><g transform="matrix(-1,0,0,-1,46,46)"><polygon class="left" points="9.333333,3.75 9.333333,0 0,7.5 9.333333,15 9.333333,11.25 14,11.25 14,3.75 " transform="matrix(-1,0,0,1,46,15.5)"/><path class="dark" d="M 36.161105,15.5 45.494438,23"/><path d="m 45.494438,23 -9.333333,7.5" class="dark"/><path d="m 36.161105,30.5 0,-3.75"/><path class="dark" d="m 36.161105,26.75 -4.666667,0"/><path d="m 31.494438,26.75 0,-7.5"/><path d="m 31.494438,19.25 4.666667,0"/><path d="m 36.161105,19.25 0,-3.75"/></g><g transform="matrix(0,-1,1,0,0,46)"><polygon class="up" transform="matrix(-1,0,0,1,46,15.5)" points="9.333333,15 9.333333,11.25 14,11.25 14,3.75 9.333333,3.75 9.333333,0 0,7.5 "/><path d="M 36.161105,15.5 45.494438,23" class="dark"/><path d="m 45.494438,23 -9.333333,7.5" class="dark"/><path d="m 36.161105,30.5 0,-3.75"/><path d="m 36.161105,26.75 -4.666667,0"/><path d="m 31.494438,26.75 0,-7.5"/><path d="m 31.494438,19.25 4.666667,0" class="dark"/><path d="m 36.161105,19.25 0,-3.75"/></g></svg>';

export const Direction = {
	None: 0,
	North: 1 << 0,
	East: 1 << 1,
	South: 1 << 2,
	West: 1 << 3
};

class Location extends Component {
	public static readonly tagName = "wf-location";
	private _mask: number = Direction.None;
	private _svg: SVGElement = null;

	get mask() {
		return this._mask;
	}

	set mask(mask) {
		this._mask = mask;
		this._updateClassList();
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.innerHTML = LocationSVG;
		this._svg = this.querySelector("svg");
		this._updateClassList();
	}

	private _updateClassList() {
		const classList = this._svg.classList;
		const set = (on: number, c: string) => (on ? classList.add(c) : classList.remove(c));

		set(this._mask & Direction.North, "up");
		set(this._mask & Direction.South, "down");
		set(this._mask & Direction.West, "left");
		set(this._mask & Direction.East, "right");
	}
}

export default Location;
