import { InputManager, Direction } from "src/engine/input";
import { identity } from "src/util";
import Syntax from "./syntax";

class RecordingInputManager extends InputManager {
	private _implementation: InputManager;
	private _records: string[] = [];
	public isRecording: boolean = false;

	constructor(implementation: InputManager) {
		super();

		this._implementation = implementation;
	}

	public clearRecord() {
		this._records = [];
	}

	public dumpRecord() {
		return this._records;
	}

	private recordOne() {
		if (!this.isRecording) return;
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
		if (this.directions & Direction.Up & Direction.Left) return "NorthWest";
		if (this.directions & Direction.Up & Direction.Right) return "NorthEast";
		if (this.directions & Direction.Down & Direction.Left) return "SouthWest";
		if (this.directions & Direction.Down & Direction.Right) return "SouthEast";
		if (this.directions & Direction.Down) return "South";
		if (this.directions & Direction.Left) return "West";
		if (this.directions & Direction.Right) return "East";
		return null;
	}

	get mouseLocationInView() {
		return this._implementation && this._implementation.mouseLocationInView;
	}

	public addListeners(): void {
		this._implementation && this._implementation.addListeners();
	}

	public removeListeners(): void {
		this._implementation && this._implementation.removeListeners();
	}

	public set mouseDownHandler(s) {
		this._implementation && (this._implementation.mouseDownHandler = s);
	}

	public get mouseDownHandler() {
		return this._implementation.mouseDownHandler;
	}

	public set keyDownHandler(s) {
		this._implementation && (this._implementation.keyDownHandler = s);
	}

	public get keyDownHandler() {
		return this._implementation && this._implementation.keyDownHandler;
	}

	public set placeTileHandler(s) {
		this._implementation && (this._implementation.placeTileHandler = s);
	}

	public get placeTileHandler() {
		return this._implementation && this._implementation.placeTileHandler;
	}

	public set pause(s) {
		this._implementation && (this._implementation.pause = s);
	}

	public get pause() {
		return this._implementation && this._implementation.pause;
	}

	public set locator(s) {
		this._implementation && (this._implementation.locator = s);
	}

	public get locator() {
		return this._implementation && this._implementation.locator;
	}

	public set scrollDown(s) {
		this._implementation && (this._implementation.scrollDown = s);
	}

	public get scrollDown() {
		return this._implementation && this._implementation.scrollDown;
	}

	public set scrollUp(s) {
		this._implementation && (this._implementation.scrollUp = s);
	}

	public get scrollUp() {
		return this._implementation && this._implementation.scrollUp;
	}

	public set endDialog(s) {
		this._implementation && (this._implementation.endDialog = s);
	}

	public get endDialog() {
		return this._implementation && this._implementation.endDialog;
	}

	public set pickUp(s) {
		this._implementation && (this._implementation.pickUp = s);
	}

	public get pickUp() {
		return this._implementation && this._implementation.pickUp;
	}

	public set currentItem(s) {
		this._implementation && (this._implementation.currentItem = s);
	}

	public get currentItem() {
		return this._implementation && this._implementation.currentItem;
	}

	public set engine(s) {
		if (this._implementation && this._implementation.engine) {
			this._implementation.engine.metronome.onbeforetick = identity;
		}

		this._implementation && (this._implementation.engine = s);

		if (this._implementation && this._implementation.engine) {
			this._implementation.engine.metronome.onbeforetick = () => this.recordOne();
		}
	}

	public get engine() {
		return this._implementation.engine;
	}

	get directions() {
		return this._implementation && this._implementation.directions;
	}

	get walk() {
		return this._implementation && this._implementation.walk;
	}

	get drag() {
		return this._implementation && this._implementation.drag;
	}

	get attack() {
		return this._implementation && this._implementation.attack;
	}
}

export default RecordingInputManager;
