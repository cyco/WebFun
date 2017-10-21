import { SceneManager } from "src/engine";
import Settings from "src/settings";
import { View } from "src/ui";
import { rgb } from "src/util";
import DebugInfoSceneManager from "../../debug/debug-info-scene-manager";

class SceneView extends View {
	private _manager: SceneManager;

	constructor() {
		super(document.createElement("canvas"));

		this._manager = this._buildSceneManager();
		this._setupCanvas();
	}

	private _buildSceneManager() {
		if (Settings.debug) return new DebugInfoSceneManager();
		return new SceneManager();
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
