import Engine from "../engine";
import { Point } from "src/util";
import { Renderer } from "../rendering";

abstract class SceneNotBuiltin {
	public engine: Engine = null;

	get cameraOffset(): Point {
		return this.engine.camera.offset;
	}

	public abstract render(renderer: Renderer): void;

	public abstract async update(ticks: number): Promise<void>;

	willShow(): void {}

	didShow(): void {}

	willHide(): void {}

	didHide(): void {}

	isOpaque(): boolean {
		return true;
	}
}

export default SceneNotBuiltin;
