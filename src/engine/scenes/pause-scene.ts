import { Renderer } from "../rendering";
import Scene from "./scene";
import { Tile } from "src/engine/objects";
import { InputMask } from "../input";

const PauseImageSrc =
	"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMElEQVRYw+3QoQEAAAjDsO3/o+EMBKmpT5NMjpvLlwABAgQIECBAgAABAgQIEHgvsI0fDxA3PoMxAAAAAElFTkSuQmCC";

class PauseScene extends Scene {
	private _image: HTMLImageElement;

	constructor() {
		super();

		const image = new Image();
		image.width = Tile.WIDTH;
		image.height = Tile.HEIGHT;
		image.src = PauseImageSrc;
		image.className = "pixelated";
		this._image = image;
	}

	willShow() {
		this.engine.inputManager.clear();
		this.engine.temporaryState.totalPlayTime +=
			(new Date().getTime() - this.engine.temporaryState.currentPlayStart.getTime()) / 1000;
		this.engine.temporaryState.currentPlayStart = new Date();
	}

	render(renderer: Renderer): void {
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				// TODO: remove access to protected method
				renderer.drawImage(this._image, x * Tile.WIDTH, y * Tile.HEIGHT);
			}
		}
	}

	async update(ticks: number) {
		const engine = this.engine;
		const inputManager = engine.inputManager.readInput(ticks);
		if (inputManager & InputMask.Pause) {
			engine.sceneManager.popScene();
		}
	}

	willHide() {
		this.engine.temporaryState.currentPlayStart = new Date();
		this.engine.inputManager.clear();
	}

	isOpaque() {
		return false;
	}
}

export default PauseScene;
