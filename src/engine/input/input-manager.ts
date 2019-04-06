import Engine from "../engine";
import { Point } from "src/util";
import { Tile } from "../objects";
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
	public currentItem: Tile = null;

	public engine: Engine = null;

	// zone scene
	public readonly directions: number;
	public readonly walk: boolean;
	public readonly drag: boolean;
	public readonly attack: boolean;

	public placedTile: Tile;
	public placedTileLocation: Point;
	public abstract clearPlacedTile(): void;

	// zone scene / locator sceen
	public readonly locator: boolean;

	// zone scene / pause sceen
	public readonly pause: boolean;

	// pickup scene
	public readonly pickUp: boolean;

	// speech scene
	public readonly scrollDown: boolean;
	public readonly scrollUp: boolean;
	public readonly endDialog: boolean;

	abstract readonly mouseLocationInView: Point;

	public abstract addListeners(): void;

	public abstract removeListeners(): void;
}

export default InputManager;
