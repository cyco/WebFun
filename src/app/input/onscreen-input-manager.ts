import { InputManager, InputMask } from "src/engine/input";
import { Tile } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";

class OnscreenInputManager implements InputManager {
	public mouseDownHandler: (_: Point) => void;
	public keyDownHandler: (_: KeyboardEvent) => void;
	public currentItem: Tile;
	public engine: Engine;
	public directions: number;
	public walk: boolean;
	public drag: boolean;
	public scrollUp: boolean;
	public placedTile: Tile;
	public placedTileLocation: Point;
	public locator: boolean;
	public pause: boolean;
	public pickUp: boolean;
	public scrollDown: boolean;
	public endDialog: boolean;
	public attack: boolean;
	public mouseLocationInView: Point;

	public lastDirectionInput: number = performance.now();
	private _currentInput: number;

	public clear(): void {
		this._currentInput &= ~InputMask.Locator;
		this._currentInput &= ~InputMask.Pause;
	}

	public addListeners(): void {}
	public readInput(_: number): InputMask {
		return InputMask.None;
	}
	public removeListeners(): void {}
}

export default OnscreenInputManager;
