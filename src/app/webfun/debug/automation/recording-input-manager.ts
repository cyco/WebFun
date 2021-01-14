import InputMask from "src/engine/input/input-mask";
import { Direction, InputManager } from "src/engine/input";
import { Metronome, Engine } from "src/engine";
import { Tile } from "src/engine/objects";
import { Point } from "src/util";

import { InputManager as AppInputManager } from "src/app/webfun/input";
import Syntax from "./syntax";

class RecordingInputManager implements InputManager {
	public placedTile: Tile;
	public placedTileLocation: Point;
	public readonly implementation: AppInputManager;
	private _records: string[] = [];
	public isRecording: boolean = false;
	_input: InputMask;

	constructor(implementation: AppInputManager) {
		this.implementation = implementation;
	}

	public clearRecords(): void {
		this._records = [];
	}

	public set records(s: string[]) {
		this._records = s;
	}

	public get records(): string[] {
		return this._records;
	}

	private recordOne() {
		const input = this.implementation.readInput(0);
		this._input = input;

		if (!this.isRecording) return;

		let direction;
		if (input & InputMask.Attack) {
			this._records.push(Syntax.Attack);
		} else if (
			input & InputMask.Walk &&
			input & InputMask.Drag &&
			(direction = this._currentDragDirection())
		) {
			this._records.push((Syntax.Drag as any)[direction]);
		} else if (input & InputMask.Walk && (direction = this._currentMoveDirection())) {
			this._records.push((Syntax.Move as any)[direction]);
		} else {
			this._records.push(".");
		}
	}

	private _currentDragDirection(): "North" | "East" | "West" | "South" | null {
		if (this.directions & Direction.Up) return "North";
		if (this.directions & Direction.Down) return "South";
		if (this.directions & Direction.Left) return "West";
		if (this.directions & Direction.Right) return "East";
		return null;
	}

	private _currentMoveDirection():
		| "North"
		| "East"
		| "West"
		| "South"
		| "NorthEast"
		| "NorthWest"
		| "SouthEast"
		| "SouthWest"
		| null {
		const isSet = (mask: number) => (this.directions & mask) === mask;

		if (isSet(Direction.Up | Direction.Left)) return "NorthWest";
		if (isSet(Direction.Up | Direction.Right)) return "NorthEast";
		if (isSet(Direction.Down | Direction.Left)) return "SouthWest";
		if (isSet(Direction.Down | Direction.Right)) return "SouthEast";
		if (isSet(Direction.Up)) return "North";
		if (isSet(Direction.Down)) return "South";
		if (isSet(Direction.Left)) return "West";
		if (isSet(Direction.Right)) return "East";

		return null;
	}

	public addListeners(): void {
		this.implementation && this.implementation.addListeners();
	}

	public removeListeners(): void {
		this.engine.removeEventListener(Engine.Event.CurrentZoneChange, this);
	}

	public clear(): void {
		this.implementation && this.implementation.clear();
		this._input = 0;
	}

	get mouseLocationInView(): Point {
		return this.implementation && this.implementation.mouseLocationInView;
	}

	public set mouseDownHandler(s: (_: Point) => void) {
		this.implementation && (this.implementation.mouseDownHandler = s);
	}

	public get mouseDownHandler(): (_: Point) => void {
		return this.implementation.mouseDownHandler;
	}

	public set keyDownHandler(s: (_: KeyboardEvent) => void) {
		this.implementation && (this.implementation.keyDownHandler = s);
	}

	public get keyDownHandler(): (_: KeyboardEvent) => void {
		return this.implementation && this.implementation.keyDownHandler;
	}

	public set currentItem(s: Tile) {
		this.implementation && (this.implementation.currentItem = s);
	}

	public get currentItem(): Tile {
		return this.implementation && this.implementation.currentItem;
	}

	public handleEvent(e: CustomEvent): void {
		if (e.type === Engine.Event.WeaponChanged) {
			const id = (e.detail as any).weapon.id;
			this._records.push(`${Syntax.Place.Start} ${id.toHex(3)}${Syntax.Place.End}`);
			return;
		}

		if (e.type === Metronome.Event.Start) {
			if (this.placedTile && this.placedTileLocation) {
				const id = this.placedTile.id;
				const { x, y } = this.placedTileLocation;

				this._records.push(`${Syntax.Place.Start} ${id.toHex(3)} at ${x}x${y}${Syntax.Place.End}`);
				return;
			}
		}
	}

	public set engine(s: Engine) {
		if (this.implementation && this.implementation.engine) {
			this.implementation.engine.removeEventListener(Engine.Event.WeaponChanged, this);
			this.implementation.engine.metronome.removeEventListener(Metronome.Event.Start, this);
			this.implementation.engine.metronome.removeEventListener(Metronome.Event.BeforeTick, this);
		}

		this.implementation && (this.implementation.engine = s);

		if (this.implementation && this.implementation.engine) {
			this.implementation.engine.metronome.addEventListener(Metronome.Event.Start, this);
			this.implementation.engine.metronome.addEventListener(Metronome.Event.BeforeTick, this);
			this.implementation.engine.addEventListener(Engine.Event.WeaponChanged, this);
		}
	}

	public get engine(): Engine {
		return this.implementation.engine;
	}

	public readInput(_: number): number {
		this.recordOne();
		return this._input;
	}

	private get directions() {
		const input = this._input;

		let result: number = 0;
		if (input & InputMask.Up) result |= Direction.Up;
		if (input & InputMask.Down) result |= Direction.Down;
		if (input & InputMask.Left) result |= Direction.Left;
		if (input & InputMask.Right) result |= Direction.Right;

		return result;
	}
}

export default RecordingInputManager;
