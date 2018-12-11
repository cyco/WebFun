import { InputManager, Direction } from "src/engine/input";
import { identity } from "src/util";
import Syntax from "./syntax";

class RecordingInputManager extends InputManager {
	public readonly implementation: InputManager;
	private _records: string[] = [];
	public isRecording: boolean = false;

	constructor(implementation: InputManager) {
		super();

		this.implementation = implementation;
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
		return this.implementation && this.implementation.mouseLocationInView;
	}

	public addListeners(): void {
		this.implementation && this.implementation.addListeners();
	}

	public removeListeners(): void {
		this.implementation && this.implementation.removeListeners();
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

	public set placeTileHandler(s) {
		this.implementation && (this.implementation.placeTileHandler = s);
	}

	public get placeTileHandler() {
		return this.implementation && this.implementation.placeTileHandler;
	}

	public set pause(s) {
		this.implementation && (this.implementation.pause = s);
	}

	public get pause() {
		return this.implementation && this.implementation.pause;
	}

	public set locator(s) {
		this.implementation && (this.implementation.locator = s);
	}

	public get locator() {
		return this.implementation && this.implementation.locator;
	}

	public set scrollDown(s) {
		this.implementation && (this.implementation.scrollDown = s);
	}

	public get scrollDown() {
		return this.implementation && this.implementation.scrollDown;
	}

	public set scrollUp(s) {
		this.implementation && (this.implementation.scrollUp = s);
	}

	public get scrollUp() {
		return this.implementation && this.implementation.scrollUp;
	}

	public set endDialog(s) {
		this.implementation && (this.implementation.endDialog = s);
	}

	public get endDialog() {
		return this.implementation && this.implementation.endDialog;
	}

	public set pickUp(s) {
		this.implementation && (this.implementation.pickUp = s);
	}

	public get pickUp() {
		return this.implementation && this.implementation.pickUp;
	}

	public set currentItem(s) {
		this.implementation && (this.implementation.currentItem = s);
	}

	public get currentItem() {
		return this.implementation && this.implementation.currentItem;
	}

	public set engine(s) {
		if (this.implementation && this.implementation.engine) {
			this.implementation.engine.metronome.onbeforetick = identity;
		}

		this.implementation && (this.implementation.engine = s);

		if (this.implementation && this.implementation.engine) {
			this.implementation.engine.metronome.onbeforetick = () => this.recordOne();
		}
	}

	public get engine() {
		return this.implementation.engine;
	}

	get directions() {
		return this.implementation && this.implementation.directions;
	}

	get walk() {
		return this.implementation && this.implementation.walk;
	}

	get drag() {
		return this.implementation && this.implementation.drag;
	}

	get attack() {
		return this.implementation && this.implementation.attack;
	}
}

export default RecordingInputManager;
