import { Component } from "src/ui";
import { Point } from "src/util";
import { Tile } from "src/engine/objects";
import "./token.scss";

class Token extends Component {
	static readonly TagName = "wf-action-editor-token";
	private _point: Point;
	private _sound: string;
	private _tile: Tile;
	private _details: HTMLElement;

	protected connectedCallback() {
		super.connectedCallback();

		this.addEventListener("mouseenter", this);
		this.addEventListener("mouseleave", this);
	}

	public handleEvent(event: MouseEvent) {
		if (event.type === "mouseenter") {
			if (this._details) this._details.remove();
			this._details = null;
			return;
		}

		if (this.point) {
		}

		if (this.tile) {
		}

		if (this.sound) {
		}

		if (this._details) {
			this.appendChild(this._details);
		}
	}

	protected disconnectedCallback() {
		super.disconnectedCallback();

		this.removeEventListener("mouseover", this);
		this.removeEventListener("mouseenter", this);
		this.removeEventListener("mouseleave", this);
	}

	set point(p: Point) {
		this._point = p;
	}

	get point() {
		return this._point;
	}

	set tile(tile: Tile) {
		this._tile = tile;
	}

	get tile() {
		return this._tile;
	}

	set sound(sound: string) {
		this._sound = sound;
	}

	get sound() {
		return this._sound;
	}
}

export default Token;
