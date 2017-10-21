import { Point } from "src/util";
import Engine from "../engine";
import { Renderer } from "../rendering";

abstract class Scene {
	public engine: Engine = null;

	get cameraOffset(): Point {
		// TODO: remove access to private variable stack and dependency on stack order
		return (<any>this.engine.sceneManager)._stack[0].camera.offset;
	}

	public abstract render(renderer: Renderer): void;

	public abstract update(ticks: number): void;

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
}

export default Scene;
