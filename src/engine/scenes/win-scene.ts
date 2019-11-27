import { Renderer } from "../rendering";
import Scene from "./scene";
import ZoneScene from "./zone-scene";
import { Zone } from "src/engine/objects";
import { Point } from "src/util";
import CanvasRenderer from "src/app/rendering/canvas/canvas-renderer";
import { round } from "src/std/math";
import Settings from "src/settings";
import { InputMask } from "../input";

class WinScene extends Scene {
	private _zoneScene: ZoneScene;
	public readonly score: string;
	private _ticksUntilScoreIsShown = 11;
	private _originalLocation: Point = new Point(0, 0);

	public constructor(score: number) {
		super();

		this.score = round(score).toString(10);
	}

	public willShow(): void {
		const engine = this.engine;

		this._originalLocation = engine.hero.location;
		engine.hero.visible = false;
		engine.hero.location = new Point(0, 0);
		engine.camera.update(0);

		this._zoneScene = new ZoneScene(
			engine,
			engine.assets.find(Zone, ({ type }) => type === Zone.Type.Win)
		);
		this._zoneScene.willShow();
	}

	public didShow(): void {
		this.engine.temporaryState.justEntered = true;
		this._zoneScene.didShow();
		if (Settings.skipWinScene) this.engine.sceneManager.popScene();
	}

	async update(ticks: number) {
		this._ticksUntilScoreIsShown -= 1;
		if (this._ticksUntilScoreIsShown < 0) {
			const engine = this.engine;
			const input = engine.inputManager.readInput(ticks);
			if (input & InputMask.Locator || input & InputMask.Attack || input & InputMask.Walk) {
				engine.sceneManager.popScene();
				return;
			}
		}
		this._zoneScene.update(ticks);
	}

	render(renderer: Renderer) {
		this._zoneScene.render(renderer);

		if (this._ticksUntilScoreIsShown > 0) return;
		if (!(renderer instanceof CanvasRenderer)) return;
		renderer.renderText(this.score, new Point(201, 239), { textAlign: "center" });
	}

	public willHide(): void {
		this._zoneScene.willHide();

		this.engine.hero.location = this._originalLocation;
		this.engine.hero.visible = true;
		this.engine.camera.update(0);
	}

	public didHide(): void {
		this._zoneScene.didHide();
	}
}

export default WinScene;
