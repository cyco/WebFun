import Engine from "../engine";
import { Point } from "src/util";
import { Tile } from "../objects";
import InputMask from "./input-mask";

interface InputManager {
	mouseDownHandler: (_: Point) => void;
	keyDownHandler: (_: KeyboardEvent) => void;
	currentItem: Tile;
	engine: Engine;

	placedTile: Tile;
	placedTileLocation: Point;
	clear(): void;

	readonly mouseLocationInView: Point;

	addListeners(): void;
	readInput(tick: number): InputMask;
	removeListeners(): void;
}

export default InputManager;
