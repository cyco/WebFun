import { Tile } from "src/engine/objects";
import AbstractRenderer from "../rendering/abstract-renderer";
import Scene from "./scene";

class PauseScene extends Scene {
	private _image: HTMLImageElement;

	constructor() {
		super();

		const image = new Image();
		image.width = Tile.WIDTH;
		image.height = Tile.HEIGHT;
		this._image = image;
	}

	render(renderer: AbstractRenderer): void {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				renderer.renderImage({ representation: this._image }, x * Tile.WIDTH, y * Tile.HEIGHT);
			}
		}
	}

	async update(/*ticks*/) {
		const engine = this.engine;
		const inputManager = engine.inputManager;
		if (!inputManager.pause) {
			engine.sceneManager.popScene();
		}
	}

	isOpaque() {
		return false;
	}
}

export default PauseScene;
