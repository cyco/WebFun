import { InputManager, InputMask, Direction } from "src/engine/input";
import { Point, Direction as DirectionHelper } from "src/util";
import { Tile } from "src/engine/objects";
import { Engine } from "src/engine";
import { OnscreenPad, OnscreenButton } from "src/app/ui";

class TouchInputManager implements InputManager {
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

	readInput(tick: number): InputMask {
		let input = InputMask.None;

		if (this.shoot.pressed) input |= InputMask.Attack;
		if (this.drag.pressed) input |= InputMask.Drag;

		input |= this.pad.input;

		return input;
	}

	clear(): void {}

	addListeners(): void {}

	removeListeners(): void {}
}
export default TouchInputManager;
