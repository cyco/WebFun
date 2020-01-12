import { InputManager, InputMask, Direction } from "src/engine/input";
import { Point, Direction as DirectionHelper } from "src/util";
import { Tile } from "src/engine/objects";
import { Engine } from "src/engine";
import { Pad, Shoot, Drag } from "src/app/ui/onscreen-controls";

class TouchInputManager implements InputManager, EventListenerObject {
	mouseDownHandler: (_: Point) => void;
	keyDownHandler: (_: KeyboardEvent) => void;
	currentItem: Tile;
	engine: Engine;
	placedTile: Tile;
	mouseLocationInView: Point;
	placedTileLocation: Point;

	public constructor(
		private gameViewElement: HTMLElement,
		private pad: Pad,
		private shoot: Shoot,
		private drag: Drag
	) {
		console.log("this.pad", this.pad);
		console.log("this.shoot", this.shoot);
		console.log("this.drag", this.drag);
	}

	readInput(tick: number): InputMask {
		let input = InputMask.None;

		if (this.shoot.pressed) input |= InputMask.Attack;
		if (this.shoot.pressed) console.log("shoot", this.shoot, this.shoot.pressed);
		if (this.drag.pressed) input |= InputMask.Drag;

		input |= this.pad.input;

		return input;
	}

	clear(): void {}

	addListeners(): void {}

	removeListeners(): void {}

	handleEvent(evt: Event): void {}
}
export default TouchInputManager;
