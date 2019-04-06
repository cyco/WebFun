import DebugInfoScene from "./debug-info-scene";
import { Renderer } from "../engine/rendering";
import { SceneManager } from "../engine";
import Settings from "../settings";

class DebugInfoSceneManager extends SceneManager {
	private _debugInfoScene = new DebugInfoScene();

	async update(ticks: number): Promise<void> {
		await super.update(ticks);
		await this._debugInfoScene.update(ticks);
	}

	render(renderer: Renderer): void {
		super.render(renderer);
		if (Settings.drawDebugStats) {
			this._debugInfoScene.render(renderer);
		}
	}
}

export default DebugInfoSceneManager;
