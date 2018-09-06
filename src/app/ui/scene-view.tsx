import { SceneManager } from "src/engine";
import Settings from "src/settings";
import { rgb } from "src/util";
import DebugInfoSceneManager from "../../debug/debug-info-scene-manager";
import Component from "src/ui/component";
import "./scene-view.scss";

class SceneView extends Component {
	public static readonly tagName = "wf-scene-view";
	public readonly canvas: HTMLCanvasElement = (
		<canvas
			className="pixelated"
			width={288}
			height={288}
			style={{ background: rgb(0, 0, 0) } as CSSStyleDeclaration}
		/>
	) as HTMLCanvasElement;
	private _manager: SceneManager = this._buildSceneManager();

	protected connectedCallback() {
		this.appendChild(this.canvas);
	}

	get manager() {
		return this._manager;
	}

	private _buildSceneManager() {
		if (Settings.debug) return new DebugInfoSceneManager();
		return new SceneManager();
	}
}

export default SceneView;
