import { Point } from "src/util";
import { Tile } from "../objects";
import Engine from "../engine";
import TilePlacedEvent from "./tile-placed-event";

export const Direction = {
	Up: 1 << 0,
	Down: 1 << 1,
	Left: 1 << 2,
	Right: 1 << 3
};

abstract class InputManager {
	public mouseDownHandler = (_: Point): void => void 0;
	public keyDownHandler = (_: KeyboardEvent): void => void 0;
	public placeTileHandler = (_: TilePlacedEvent): void => void 0;
	public pause: boolean = false;
	public locator: boolean = false;
	public scrollDown: boolean = false;
	public scrollUp: boolean = false;
	public endDialog: boolean = false;
	public pickUp: boolean = false;
	public currentItem: Tile = null;

	public engine: Engine = null;

	protected _direction: number = 0;
	protected _drag: boolean = false;
	protected _attack: boolean = false;
	protected _walk: boolean = false;

	get directions() {
		return this._direction;
	}

	get walk() {
		return this._walk;
	}

	get drag() {
		return this._drag;
	}

	get attack() {
		return this._attack;
	}

	abstract readonly mouseLocationInView: Point;

	public abstract addListeners(): void;

	public abstract removeListeners(): void;
}

export default InputManager;
