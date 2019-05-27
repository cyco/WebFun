import Engine from "../engine";
import { Point } from "src/util";
import { Tile } from "../objects";

interface InputManager {
	mouseDownHandler: (_: Point) => void;
	keyDownHandler: (_: KeyboardEvent) => void;
	currentItem: Tile;
	engine: Engine;

	// zone scene
	readonly directions: number;
	readonly walk: boolean;
	readonly drag: boolean;
	readonly attack: boolean;

	placedTile: Tile;
	placedTileLocation: Point;
	clear(): void;

	// zone scene / locator sceen
	readonly locator: boolean;

	// zone scene / pause sceen
	readonly pause: boolean;

	// pickup scene
	readonly pickUp: boolean;

	// speech scene
	readonly scrollDown: boolean;
	readonly scrollUp: boolean;
	readonly endDialog: boolean;

	readonly mouseLocationInView: Point;

	addListeners(): void;

	removeListeners(): void;
}

export default InputManager;
