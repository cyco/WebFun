import { Renderer } from "../rendering";
import Scene from "./scene";
import ZoneScene from "./zone-scene";
import { Zone } from "src/engine/objects";

class LoseScene extends Scene {
	private _zoneScene: ZoneScene;

	public willShow(): void {
		this._zoneScene = new ZoneScene();
		this.engine.hero.visible = false;
		this._zoneScene.engine = this.engine;
		this._zoneScene.zone = this.engine.assets.find(Zone, ({ type }) => type === Zone.Type.Lose);
		this._zoneScene.willShow();
	}

	public didShow(): void {
		this._zoneScene.didShow();
		this.engine.metronome.stop();
	}

	async update(_: number) {}

	render(renderer: Renderer) {
		this._zoneScene.render(renderer);
	}

	public willHide(): void {
		this._zoneScene.willHide();
	}

	public didHide(): void {
		this._zoneScene.didHide();
	}

	public isOpaque() {
		return false;
	}
}

export default LoseScene;
