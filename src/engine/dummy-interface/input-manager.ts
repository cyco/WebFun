import { InputManager } from "../input";
import { Point } from "src/util";

class DummyInputManager implements InputManager {
	public mouseDownHandler: (_: Point) => void;
	public keyDownHandler: (_: KeyboardEvent) => void;
	public currentItem: import("../objects").Tile;
	public engine: import("../engine").default;
	public directions: number;
	public walk: boolean;
	public drag: boolean;
	public scrollUp: boolean;
	public placedTile: import("../objects").Tile;
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
	public removeListeners(): void {}
}

export default DummyInputManager;
