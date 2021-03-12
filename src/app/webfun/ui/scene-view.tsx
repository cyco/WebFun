import "./scene-view.scss";

import { rgb } from "src/util";
import Component from "src/ui/component";
import { SceneManager } from "src/engine";

class SceneView extends Component {
	public static readonly tagName = "wf-scene-view";
	public readonly canvas: HTMLCanvasElement = (
		<canvas className="pixelated" width={288} height={288} style={{ background: rgb(0, 0, 0) }} />
	) as HTMLCanvasElement;
	private _manager: SceneManager = new SceneManager();

	protected connectedCallback(): void {
		this.appendChild(this.canvas);
	}

	get manager(): SceneManager {
		return this._manager;
	}
}

export default SceneView;
