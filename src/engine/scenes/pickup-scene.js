import Scene from "./scene";

export default class PickupScene extends Scene {
	constructor(engine = null) {
		super();

		this.engine = engine;
		this.tile = null;
		this.location = null;
		this._ticks = 0;
	}

	render(renderer) {
		if (this._ticks % 10 >= 5) {
			const cameraOffset = this.cameraOffset;
			const x = this.location.x + cameraOffset.x;
			const y = this.location.y + cameraOffset.y;
			renderer.renderTile(this.tile, x, y);
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
}
