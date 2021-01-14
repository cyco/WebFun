import { InputManager, InputMask } from "src/engine/input";
import { Point } from "src/util";
import { Tile } from "src/engine/objects";
import { Engine } from "src/engine";
import { OnscreenPad, OnscreenButton } from "src/app/webfun/ui";
import { PickupScene } from "src/engine/scenes";

class OnscreenManager implements InputManager {
	mouseDownHandler: (_: Point) => void;
	keyDownHandler: (_: KeyboardEvent) => void;
	currentItem: Tile;
	engine: Engine;
	placedTile: Tile;
	mouseLocationInView: Point;
	placedTileLocation: Point;

	public constructor(
		private gameViewElement: HTMLElement,
		private pad: OnscreenPad,
		private shoot: OnscreenButton,
		private drag: OnscreenButton
	) {}

	readInput(_: number): InputMask {
		let input = InputMask.None;

		if (this.shoot.pressed) input |= InputMask.Attack;
		if (this.drag.pressed) input |= InputMask.Drag;

		input |= this.pad.input;

		return input;
	}

	clear(): void {}

	addListeners(): void {
		this.gameViewElement.addEventListener("touchstart", this);
		this.gameViewElement.addEventListener("mousedown", this);
	}

	handleEvent(e: TouchEvent): void {
		if (this.engine?.sceneManager?.currentScene instanceof PickupScene) {
			this.engine.sceneManager.popScene();
			return;
		}

		if (e.type === "touchstart") {
			const location = new Point(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
			const point = this.convertClientCoordinatesToView(location);
			this.mouseLocationInView = location;
			this.mouseDownHandler && this.mouseDownHandler(point);
			this.mouseLocationInView = null;
		}
	}

	private convertClientCoordinatesToView(location: Point): Point {
		const boundingRect = this.gameViewElement.getBoundingClientRect();
		const viewOffset = new Point(boundingRect.left, boundingRect.top);

		return Point.subtract(location, viewOffset).dividedBy(boundingRect);
	}

	removeListeners(): void {
		this.gameViewElement.removeEventListener("mousedown", this);
		this.gameViewElement.removeEventListener("touchstart", this);
	}

	public get lastDirectionInput(): number {
		return this.pad.lastInput;
	}
}
export default OnscreenManager;
