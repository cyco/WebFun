import Scene from "./scene";
import { Tile } from "src/engine/objects";
import { Point, Size } from "src/util";

class DetonatorScene extends Scene {
	constructor() {
		super();
		this._detonatorLocation = null;
		this._detonatorFrames = null;
		this._ticks = -1;
		this.tileSize = new Size(Tile.WIDTH, Tile.HEIGHT);
	}

	willShow() {
		const self = this;
		this.engine.inputManager.mouseDownHandler = (p) => self.mouseDown(p);
	}

	mouseDown(p) {
		this._ticks = 0;
		this._detonatorLocation = (new Point(p)).scaleBy(9).floor();
		this.engine.inputManager.mouseDownHandler = null;
	}

	willHide() {
		this.engine.inputManager.mouseDownHandler = null;
	}

	update(/*ticks*/) {
		if (this._ticks === -1) return;

		this._ticks++;
		if (this._ticks >= this._detonatorFrames.length) {
			// TODO: damage enemeis
			this._ticks = -1;
			this.engine.sceneManager.popScene();
		}
	}

	render(renderer) {
		for (let i = 0; i <= this._ticks && i <= this._detonatorFrames.length; i++) {
			const frame = this._detonatorFrames[i];
			renderer.renderTile(frame, this._detonatorLocation.x, this._detonatorLocation.y);
		}
	}

	get engine() {
		return this._engine;
	}

	set engine(e) {
		this._engine = e;
		if (!e) return;

		const data = e.data;
		this._detonatorFrames = [0x202, 0x431, 0x432, 0x433].map((id) => data.getTile(id));
	}
}
export default DetonatorScene;
