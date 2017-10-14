import Engine from "../engine";
import { Point } from "src/util";
import { Renderer } from "../rendering";

abstract class Scene {
	public engine: Engine = null;

	abstract render(renderer: Renderer): void;

	abstract update(ticks: number): void;

	willShow(): void {
	}

	didShow(): void {
	}

	willHide(): void {
	}

	didHide(): void {
	}

	isOpaque(): boolean {
		return true;
	}

	get cameraOffset(): Point {
		// TODO: remove access to private variable stack and dependency on stack order
		return this.engine.sceneManager._stack[0].camera.offset;
	}
}

export default Scene;
