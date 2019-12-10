import InputMask from "src/engine/input/input-mask";
import { Direction, InputManager } from "src/engine/input";
import { Metronome, EngineEvents } from "src/engine";
import { Tile } from "src/engine/objects";
import { Point } from "src/util";

import { DesktopInputManager } from "src/app/input";
import Syntax from "./syntax";

class RecordingInputManager implements InputManager {
	public placedTile: Tile;
	public placedTileLocation: Point;
	public readonly implementation: DesktopInputManager;
	private _records: string[] = [];
	public isRecording: boolean = false;
	_input: InputMask;

	constructor(implementation: DesktopInputManager) {
		this.implementation = implementation;
	}

	public clearRecords() {
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
		if (this.placedTile) {
			const id = this.placedTile.id;
			const { x, y } = this.placedTileLocation;

			this._records.push(`${Syntax.Place.Start} ${id.toHex(3)} at ${x}x${y}${Syntax.Place.End}`);
		} else if (input & InputMask.Attack) {
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
		this.implementation && this.implementation.removeListeners();
	}

	public clear() {
		this.implementation && this.implementation.clear();
		this._input = 0;
	}

	get mouseLocationInView() {
		return this.implementation && this.implementation.mouseLocationInView;
	}

	public set mouseDownHandler(s) {
		this.implementation && (this.implementation.mouseDownHandler = s);
	}

	public get mouseDownHandler() {
		return this.implementation.mouseDownHandler;
	}

	public set keyDownHandler(s) {
		this.implementation && (this.implementation.keyDownHandler = s);
	}

	public get keyDownHandler() {
		return this.implementation && this.implementation.keyDownHandler;
	}

	public set currentItem(s) {
		this.implementation && (this.implementation.currentItem = s);
	}

	public get currentItem() {
		return this.implementation && this.implementation.currentItem;
	}

	public handleEvent(e: CustomEvent) {
		if (e.type === EngineEvents.WeaponChanged) {
			const id = (e.detail as any).weapon.id;
			this._records.push(`${Syntax.Place.Start} ${id.toHex(3)}${Syntax.Place.End}`);
			return;
		}

		this.recordOne();
	}

	public set engine(s) {
		if (this.implementation && this.implementation.engine) {
			this.implementation.engine.metronome.removeEventListener(Metronome.Event.BeforeTick, this);
			this.implementation.engine.removeEventListener(EngineEvents.WeaponChanged, this);
		}

		this.implementation && (this.implementation.engine = s);

		if (this.implementation && this.implementation.engine) {
			this.implementation.engine.addEventListener(EngineEvents.WeaponChanged, this);
			this.implementation.engine.metronome.addEventListener(Metronome.Event.BeforeTick, this);
		}
	}

	public get engine() {
		return this.implementation.engine;
	}

	public readInput(_: number) {
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
