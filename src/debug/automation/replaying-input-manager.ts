import { InputManager, Direction } from "src/engine/input";
import { Metronome } from "src/engine";
import { Tile } from "src/engine/objects";
import { Point } from "src/util";
import Syntax from "./syntax";

class ReplayingInputManager extends InputManager implements EventListenerObject {
	public isReplaying: boolean = false;
	public readonly input: string[];
	public readonly mouseLocationInView = new Point(0, 0);

	public placedTile: Tile = null;
	public placedTileLocation: Point = null;
	public readonly locator: boolean = false;
	public readonly pause: boolean = false;
	public readonly pickUp: boolean = false;
	public readonly scrollDown: boolean = false;
	public readonly scrollUp: boolean = false;
	public readonly endDialog: boolean = false;

	private _offset = 0;

	constructor(input: string[]) {
		super();

		this.input = input;
	}

	public reset() {
		this._offset = 0;
	}

	public handleEvent(_: Event) {
		this._offset++;

		if (this.token === Syntax.Place.Start) {
			this._offset++;
			const tileID = this.token.parseInt();
			const tile = this.engine.data.tiles[tileID];
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

		if (this._offset === this.input.length) console.log("End of Input");
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

	public get directions() {
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

	public get walk() {
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

	public get drag() {
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

	public get attack() {
		return this.token === Syntax.Attack;
	}
}

export default ReplayingInputManager;
