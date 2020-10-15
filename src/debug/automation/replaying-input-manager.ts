import InputMask from "src/engine/input/input-mask";
import { InputManager, Direction } from "src/engine/input";
import { Metronome } from "src/engine";
import { Tile } from "src/engine/objects";
import { EventTarget, Point } from "src/util";
import Syntax from "./syntax";
import { Engine } from "src/engine";

export const Event = {
	InputEnd: "InputEnd"
};

class ReplayingInputManager extends EventTarget implements InputManager, EventListenerObject {
	public static readonly Event = Event;
	public mouseDownHandler: (_: Point) => void;
	public keyDownHandler: (_: KeyboardEvent) => void;
	public currentItem: Tile;
	public engine: Engine;
	public isReplaying: boolean = false;
	private _input: string[] = [];
	public readonly mouseLocationInView = new Point(0, 0);

	public placedTile: Tile = null;
	public placedTileLocation: Point = null;
	private locator: boolean = false;
	private pause: boolean = false;
	private scrollDown: boolean = false;
	private scrollUp: boolean = false;
	private endDialog: boolean = false;

	private _offset = 0;

	public reset(): void {
		this._offset = 0;
	}

	public handleEvent(_: Event): void {
		if (this.token === Syntax.Place.Start) {
			this._offset++;
			const tileID = this.token.parseInt();
			const tile = this.engine.assets.get(Tile, tileID);
			this._offset++;

			if (this.token !== "at") {
				this.engine.equip(tile);
				return;
			}

			this._offset++;
			const [x, y] = this.token.split("x").map(x => x.parseInt());

			if (this.engine.inventory.contains(tile)) {
				this.placedTile = tile;
				this.placedTileLocation = new Point(x, y);
			}
		}

		if (this._offset === this.input.length) {
			this.dispatchEvent(new CustomEvent(Event.InputEnd));
		}
	}

	readInput(_: number): InputMask {
		let result = InputMask.None;

		if (this.pause) result |= InputMask.Pause;
		if (this.locator) result |= InputMask.Locator;

		if (this.endDialog) result |= InputMask.EndDialog;
		if (this.scrollDown) result |= InputMask.ScrollDown;
		if (this.scrollUp) result |= InputMask.ScrollUp;

		const directions = this.directions;
		if (directions & Direction.Left) result |= Direction.Left;
		if (directions & Direction.Up) result |= Direction.Up;
		if (directions & Direction.Down) result |= Direction.Down;
		if (directions & Direction.Right) result |= Direction.Right;
		if (this.walk) result |= InputMask.Walk;
		if (this.drag) result |= InputMask.Drag;
		if (this.attack) result |= InputMask.Attack;
		this._offset++;

		return result;
	}

	public clear(): void {
		this.placedTile = null;
		this.placedTileLocation = null;
	}

	public addListeners(): void {
		this.engine.metronome.addEventListener(Metronome.Event.AfterTick, this);
	}

	public removeListeners(): void {
		this.engine.metronome.removeEventListener(Metronome.Event.AfterTick, this);
	}

	private get token(): string {
		if (this._offset < this.input.length) {
			return this.input[this._offset];
		}

		return "";
	}

	private get directions() {
		switch (this.token) {
			case Syntax.Move.East:
			case Syntax.Drag.East:
				return Direction.Right;
			case Syntax.Move.West:
			case Syntax.Drag.West:
				return Direction.Left;
			case Syntax.Drag.North:
			case Syntax.Move.North:
				return Direction.Up;
			case Syntax.Drag.South:
			case Syntax.Move.South:
				return Direction.Down;
			case Syntax.Move.SouthEast:
				return Direction.Down | Direction.Right;
			case Syntax.Move.NorthEast:
				return Direction.Up | Direction.Right;
			case Syntax.Move.NorthWest:
				return Direction.Up | Direction.Left;
			case Syntax.Move.SouthWest:
				return Direction.Down | Direction.Left;
			default:
				return 0;
		}
	}

	private get walk() {
		switch (this.token) {
			case Syntax.Drag.East:
			case Syntax.Drag.West:
			case Syntax.Drag.North:
			case Syntax.Drag.South:
			case Syntax.Move.North:
			case Syntax.Move.NorthEast:
			case Syntax.Move.East:
			case Syntax.Move.SouthEast:
			case Syntax.Move.South:
			case Syntax.Move.SouthWest:
			case Syntax.Move.West:
			case Syntax.Move.NorthWest:
				return true;
			default:
				return false;
		}
	}

	private get drag() {
		switch (this.token) {
			case Syntax.Drag.North:
			case Syntax.Drag.East:
			case Syntax.Drag.South:
			case Syntax.Drag.West:
				return true;
			default:
				return false;
		}
	}

	private get attack() {
		return this.token === Syntax.Attack;
	}

	set input(input: string[]) {
		this._input = input;
		this.reset();
	}

	get input(): string[] {
		return this._input;
	}
}

export default ReplayingInputManager;
