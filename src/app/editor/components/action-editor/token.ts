import "./token.scss";

import { Component } from "src/ui";
import { Point } from "src/util";
import { Tile } from "src/engine/objects";

class Token extends Component {
	static readonly tagName = "wf-action-editor-token";
	private _point: Point;
	private _sound: string;
	private _tile: Tile;
	private _details: HTMLElement;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.addEventListener("mouseenter", this);
		this.addEventListener("mouseleave", this);
	}

	public handleEvent(event: MouseEvent): void {
		if (event.type === "mouseenter") {
			if (this._details) this._details.remove();
			this._details = null;
			return;
		}
		// TODO: handle this.point, this.tile, this.sound

		if (this._details) {
			this.appendChild(this._details);
		}
	}

	protected disconnectedCallback(): void {
		super.disconnectedCallback();

		this.removeEventListener("mouseover", this);
		this.removeEventListener("mouseenter", this);
		this.removeEventListener("mouseleave", this);
	}

	set point(p: Point) {
		this._point = p;
	}

	get point(): Point {
		return this._point;
	}

	set tile(tile: Tile) {
		this._tile = tile;
	}

	get tile(): Tile {
		return this._tile;
	}

	set sound(sound: string) {
		this._sound = sound;
	}

	get sound(): string {
		return this._sound;
	}
}

export default Token;
