import { View } from "src/ui";
import { rgb } from "src/util";
import { SceneManager } from "src/engine";

class SceneView extends View {
	private _manager: SceneManager;

	constructor() {
		super(document.createElement("canvas"));

		this._manager = new SceneManager();
		this._setupCanvas();
	}

	get canvas() {
		return this.element;
	}

	get manager() {
		return this._manager;
	}

	get element(): HTMLCanvasElement {
		return <HTMLCanvasElement>super.element;
	}

	_setupCanvas() {
		const canvas = this.element;
		canvas.style.backgroundColor = rgb(0, 0, 0);
		canvas.classList.add("pixelated");
		canvas.width = 288;
		canvas.height = 288;
	}
}

export default SceneView;
