import { SceneManager } from "src/engine";
import Settings from "src/settings";
import { rgb } from "src/util";
import DebugInfoSceneManager from "../../debug/debug-info-scene-manager";
import Component from "src/ui/component";
import "./scene-view.scss";

class SceneView extends Component {
	public static readonly tagName = "wf-scene-view";
	private _manager: SceneManager = this._buildSceneManager();
	public readonly canvas: HTMLCanvasElement = document.createElement("canvas");

	protected connectedCallback() {
		this.appendChild(this.canvas);
		this._setupCanvas();
	}

	get manager() {
		return this._manager;
	}

	private _setupCanvas() {
		const canvas = this.canvas;
		canvas.style.backgroundColor = rgb(0, 0, 0);
		canvas.classList.add("pixelated");
		canvas.width = 288;
		canvas.height = 288;
	}

	private _buildSceneManager() {
		if (Settings.debug) return new DebugInfoSceneManager();
		return new SceneManager();
	}
}

export default SceneView;
