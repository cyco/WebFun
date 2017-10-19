import Scene from "./scene";
import Engine from "../engine";
import Tile from "../objects/tile";
import Point from "../../util/point";
import AbstractRenderer from "../rendering/abstract-renderer";

class PickupScene extends Scene {
	public engine: Engine;
	public tile: Tile;
	public location: Point = null;
	private _ticks: number = 0;

	constructor(engine: Engine = null) {
		super();

		this.engine = engine;
	}

	render(renderer: AbstractRenderer): void {
		if (this._ticks % 10 >= 5) {
			const cameraOffset = this.cameraOffset;
			const x = this.location.x + cameraOffset.x;
			const y = this.location.y + cameraOffset.y;
			renderer.renderTile(this.tile, x, y, 1);
		}
	}

	update() {
		const engine = this.engine;
		if (engine.inputManager.pickUp) {
			engine.sceneManager.popScene();
		}

		this._ticks++;
	}

	willHide() {
		const engine = this.engine;
		const inventory = engine.inventory;

		inventory.addItem(this.tile);
	}

	isOpaque() {
		return false;
	}
}

export default PickupScene;
