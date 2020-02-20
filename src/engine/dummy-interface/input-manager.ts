import { InputManager, InputMask } from "../input";
import { Tile } from "../objects";
import Engine from "../engine";
import { Point } from "src/util";

class DummyInputManager implements InputManager {
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

	public clear(): void {}
	public addListeners(): void {}
	public readInput(_: number): InputMask {
		return InputMask.None;
	}
	public removeListeners(): void {}
}

export default DummyInputManager;
