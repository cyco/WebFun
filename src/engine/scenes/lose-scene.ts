import { Renderer } from "../rendering";
import Scene from "./scene";
import ZoneScene from "./zone-scene";
import { Zone } from "src/engine/objects";
import { Point } from "src/util";

class LoseScene extends Scene {
	private _zoneScene: ZoneScene;

	public willShow(): void {
		const engine = this.engine;
		engine.hero.isAttacking = false;
		engine.hero._actionFrames = Infinity;
		engine.hero.visible = false;
		engine.hero.location = new Point(0, 0);
		engine.camera.update(Infinity);

		this._zoneScene = new ZoneScene();
		this._zoneScene.engine = engine;
		this._zoneScene.zone = engine.assets.find(Zone, ({ type }) => type === Zone.Type.Lose);
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
