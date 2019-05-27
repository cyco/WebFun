import { Renderer } from "../rendering";
import Engine from "../engine";
import { Point } from "src/util";
import Scene from "./scene";
import Tile from "../objects/tile";
import { drawTileImageData } from "src/app/rendering";

class PickupScene extends Scene {
	public engine: Engine;
	public tile: Tile;
	public location: Point = null;
	private _ticks: number = 0;
	private _image: Image;

	constructor(engine: Engine = null) {
		super();

		this.engine = engine;
	}

	willShow() {
		super.willShow();

		this._image = null;
		const imageData = drawTileImageData(this.tile, this.engine.palette.current);
		imageData.toImage().then(img => (this._image = img));
	}

	render(renderer: Renderer): void {
		if (this._ticks % 10 >= 5) {
			const x = this.location.x + this.cameraOffset.x;
			const y = this.location.y + this.cameraOffset.y;
			// TODO: remove access to protected method
			(renderer as any).renderImage(this._image, x * Tile.WIDTH, y * Tile.HEIGHT);
		}
	}

	async update() {
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

		this._image = null;
		super.willHide();
	}

	isOpaque() {
		return false;
	}
}

export default PickupScene;
