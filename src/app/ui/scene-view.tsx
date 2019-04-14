import "./scene-view.scss";

import { Point, Rectangle, Size, rgb } from "src/util";

import Component from "src/ui/component";
import DebugInfoSceneManager from "../../debug/debug-info-scene-manager";
import { SceneManager } from "src/engine";
import Settings from "src/settings";

class SceneView extends Component {
	public static readonly tagName = "wf-scene-view";
	public readonly canvas: HTMLCanvasElement = (
		<canvas className="pixelated" width={288} height={288} style={{ background: rgb(0, 0, 0) }} />
	) as HTMLCanvasElement;
	private _manager: SceneManager = this._buildSceneManager();

	protected connectedCallback() {
		this.appendChild(this.canvas);
	}

	get manager() {
		return this._manager;
	}

	private _buildSceneManager() {
		const determineBounds = () => {
			const { left, top, width, height } = this.getBoundingClientRect();
			return new Rectangle(new Point(left, top), new Size(width, height));
		};

		if (Settings.debug) return new DebugInfoSceneManager(determineBounds);
		return new SceneManager(determineBounds);
	}
}

export default SceneView;
