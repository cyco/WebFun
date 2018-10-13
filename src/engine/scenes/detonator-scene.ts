import { Tile } from "src/engine/objects";
import { Point } from "src/util";
import Engine from "../engine";
import AbstractRenderer from "../rendering/abstract-renderer";
import Scene from "./scene";

class DetonatorScene extends Scene {
	private _detonatorLocation: Point = null;
	private _detonatorFrames: Tile[] = null;
	private _ticks: number = -1;
	private _engine: Engine = null;

	get engine(): Engine {
		return this._engine;
	}

	set engine(e) {
		this._engine = e;
		if (!e) return;

		const data = e.data;
		this._detonatorFrames = [0x202, 0x431, 0x432, 0x433].map(id => data.tiles[id]);
	}

	willShow() {
		this.engine.inputManager.mouseDownHandler = (p: Point) => this.mouseDown(p);
	}

	mouseDown(p: Point): void {
		this._ticks = 0;
		this._detonatorLocation = p
			.clone()
			.scaleBy(9)
			.floor();
		this.engine.inputManager.mouseDownHandler = () => void 0;
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = () => void 0;
	}

	async update(/*ticks*/) {
		if (this._ticks === -1) return;

		this._ticks++;
		if (this._ticks >= this._detonatorFrames.length) {
			// TODO: damage enemeis
			this._ticks = -1;
			this.engine.sceneManager.popScene();
		}
	}

	render(renderer: AbstractRenderer) {
		for (let i = 0; i <= this._ticks && i <= this._detonatorFrames.length; i++) {
			const frame = this._detonatorFrames[i];
			renderer.renderTile(frame, this._detonatorLocation.x, this._detonatorLocation.y, 3);
		}
	}
}

export default DetonatorScene;
