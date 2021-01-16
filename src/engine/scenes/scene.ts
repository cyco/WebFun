import Engine from "../engine";
import { Point } from "src/util";
import { Renderer } from "../rendering";

abstract class Scene {
	public engine: Engine = null;

	get cameraOffset(): Point {
		return this.engine.camera.offset;
	}

	public abstract render(renderer: Renderer): void;

	public abstract async update(ticks: number): Promise<void>;

	willShow(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	didShow(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	willHide(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	didHide(): void {
		/* empty definition to ensure subclasses can safely make the super call */
	}

	isOpaque(): boolean {
		return true;
	}
}

export default Scene;
