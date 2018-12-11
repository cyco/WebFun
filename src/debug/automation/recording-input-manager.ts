import { InputManager, Direction } from "src/engine/input";
import { identity } from "src/util";
import Syntax from "./syntax";

class RecordingInputManager extends InputManager {
	private _implementation: InputManager;
	private _records: string[] = [];
	private _isRecording: boolean = false;

	constructor(implementation: InputManager) {
		super();

		this._implementation = implementation;
	}

	public startRecording() {
		this._isRecording = true;
	}

	public stopRecording() {
		this._isRecording = false;
	}

	public clearRecord() {
		this._records = [];
	}

	public dumpRecord() {
		return this._records;
	}

	private recordOne() {
		if (!this._isRecording) return;
		let direction;
		if (false) {
			// TODO: handle item placement
			const id = 0;
			const x = 1;
			const y = 1;

			this._records.push(`${Syntax.Place.Start}${id.toHex(3)} ${x} ${y}${Syntax.Place.End}`);
		} else if (this.attack) {
			this._records.push(Syntax.Attack);
		} else if (this.walk && this.drag && (direction = this._currentDragDirection())) {
			this._records.push((Syntax.Drag as any)[direction]);
		} else if (this.walk && (direction = this._currentMoveDirection())) {
			this._records.push((Syntax.Move as any)[direction]);
		} else {
			this._records.push(".");
		}
	}

	private _currentDragDirection(): "North" | "East" | "West" | "South" | null {
		if (this._direction & Direction.Up) return "North";
		if (this._direction & Direction.Down) return "South";
		if (this._direction & Direction.Left) return "West";
		if (this._direction & Direction.Right) return "East";
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
		if (this._direction & Direction.Up & Direction.Left) return "NorthWest";
		if (this._direction & Direction.Up & Direction.Right) return "NorthEast";
		if (this._direction & Direction.Down & Direction.Left) return "SouthWest";
		if (this._direction & Direction.Down & Direction.Right) return "SouthEast";
		if (this._direction & Direction.Down) return "South";
		if (this._direction & Direction.Left) return "West";
		if (this._direction & Direction.Right) return "East";
		return null;
	}

	get mouseLocationInView() {
		return this._implementation.mouseLocationInView;
	}

	public addListeners(): void {
		this._implementation.addListeners();
	}

	public removeListeners(): void {
		this._implementation.removeListeners();
	}

	public set mouseDownHandler(s) {
		this._implementation.mouseDownHandler = s;
	}

	public get mouseDownHandler() {
		return this._implementation.mouseDownHandler;
	}

	public set keyDownHandler(s) {
		this._implementation.keyDownHandler = s;
	}

	public get keyDownHandler() {
		return this._implementation.keyDownHandler;
	}

	public set placeTileHandler(s) {
		this._implementation.placeTileHandler = s;
	}

	public get placeTileHandler() {
		return this._implementation.placeTileHandler;
	}

	public set pause(s) {
		this._implementation.pause = s;
	}

	public get pause() {
		return this._implementation.pause;
	}

	public set locator(s) {
		this._implementation.locator = s;
	}

	public get locator() {
		return this._implementation.locator;
	}

	public set scrollDown(s) {
		this._implementation.scrollDown = s;
	}

	public get scrollDown() {
		return this._implementation.scrollDown;
	}

	public set scrollUp(s) {
		this._implementation.scrollUp = s;
	}

	public get scrollUp() {
		return this._implementation.scrollUp;
	}

	public set endDialog(s) {
		this._implementation.endDialog = s;
	}

	public get endDialog() {
		return this._implementation.endDialog;
	}

	public set pickUp(s) {
		this._implementation.pickUp = s;
	}

	public get pickUp() {
		return this._implementation.pickUp;
	}

	public set currentItem(s) {
		this._implementation.currentItem = s;
	}

	public get currentItem() {
		return this._implementation.currentItem;
	}

	public set engine(s) {
		if (this._implementation.engine) {
			this._implementation.engine.metronome.onbeforetick = identity;
		}

		this._implementation.engine = s;

		if (this._implementation.engine) {
			this._implementation.engine.metronome.onbeforetick = () => this.recordOne();
		}
	}

	public get engine() {
		return this._implementation.engine;
	}
}

export default RecordingInputManager;
