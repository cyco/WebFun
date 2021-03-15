import { Tile } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";
import { Direction, InputMask, InputManager } from "src/engine/input";
import { CurrentStatusInfo } from "src/app/webfun/ui";
import { WindowManager } from "src/ui";

class KeyboardInputManager implements InputManager {
	public mouseDownHandler: (_: Point) => void;
	public keyDownHandler: (_: KeyboardEvent) => void;
	public currentItem: Tile;
	public engine: Engine;
	public directions: number;
	public walk: boolean;
	public drag: boolean;
	public scrollUp: boolean;
	public placedTile: Tile;
	public placedTileLocation: Point;
	public locator: boolean;
	public pause: boolean;
	public pickUp: boolean;
	public scrollDown: boolean;
	public endDialog: boolean;
	public attack: boolean;
	public mouseLocationInView: Point;

	public lastDirectionInput: number = performance.now();
	private _currentInput: InputMask;
	private _keyboardDirection: number;

	public clear(): void {
		this._currentInput &= ~InputMask.Locator;
		this._currentInput &= ~InputMask.Pause;
	}

	public addListeners(): void {
		document.addEventListener("keydown", this);
		document.addEventListener("keyup", this);
	}

	handleEvent(event: KeyboardEvent): void {
		if (
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement ||
			(event.target instanceof HTMLElement && event.target.hasAttribute("contenteditable"))
		) {
			return;
		}

		if (event.type === "keydown" && event.code === "F8" && event.ctrlKey && event.shiftKey) {
			const window = document.createElement(CurrentStatusInfo.tagName);
			window.engine = this.engine;
			window.onclose = () => this.engine.metronome.start();

			this.engine.metronome.stop();
			WindowManager.defaultManager.showWindow(window);
			window.center();

			event.stopPropagation();
			event.preventDefault();

			return;
		}

		if (!event.repeat && event.type === "keydown") this._keyDown(event);
		else if (!event.repeat && event.type === "keyup") this._keyUp(event);
	}

	private _keyDown(e: KeyboardEvent) {
		let eventHandled = true;
		let directionMask = 0;
		switch (e.code) {
			case "ArrowUp":
			case "KeyW":
				directionMask |= Direction.Up;
				this._currentInput |= InputMask.ScrollUp;
				this.lastDirectionInput = performance.now();
				break;
			case "ArrowDown":
			case "KeyS":
				this._currentInput |= InputMask.ScrollDown;
				directionMask |= Direction.Down;
				this.lastDirectionInput = performance.now();
				break;
			case "ArrowLeft":
			case "KeyA":
				directionMask |= Direction.Left;
				this.lastDirectionInput = performance.now();
				break;
			case "ArrowRight":
			case "KeyD":
				directionMask |= Direction.Right;
				this.lastDirectionInput = performance.now();
				break;
			case "Space":
				this._currentInput |= InputMask.Attack;
				this._currentInput |= InputMask.EndDialog;
				this._currentInput |= InputMask.PickUp;
				break;
			case "ShiftLeft":
			case "ShiftRight":
				this._currentInput |= InputMask.Drag;
				break;
			case "KeyP":
				this._currentInput ^= InputMask.Pause;
				break;
			case "KeyL":
				this._currentInput ^= InputMask.Locator;
				break;
			default:
				eventHandled = false;
				break;
		}

		if (e.metaKey || e.ctrlKey) return;

		this._keyboardDirection |= directionMask;
		if (this._keyboardDirection) this._currentInput |= InputMask.Walk;
		if (this.keyDownHandler) this.keyDownHandler(e);
		else if (eventHandled) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	private _keyUp(e: KeyboardEvent) {
		let eventHandled = true;
		let directionMask = 0xffff;
		switch (e.code) {
			case "ArrowUp":
			case "KeyW":
				directionMask = ~Direction.Up;
				this._currentInput &= ~InputMask.ScrollUp;
				this.lastDirectionInput = performance.now();
				break;
			case "ArrowDown":
			case "KeyS":
				directionMask &= ~Direction.Down;
				this._currentInput &= ~InputMask.ScrollDown;
				this.lastDirectionInput = performance.now();
				break;
			case "ArrowLeft":
			case "KeyA":
				directionMask &= ~Direction.Left;
				this.lastDirectionInput = performance.now();
				break;
			case "ArrowRight":
			case "KeyD":
				directionMask &= ~Direction.Right;
				this.lastDirectionInput = performance.now();
				break;
			case "Space":
				this._currentInput &= ~InputMask.Attack;
				this._currentInput &= ~InputMask.EndDialog;
				this._currentInput &= ~InputMask.PickUp;
				break;
			case "ShiftLeft":
			case "ShiftRight":
				this._currentInput &= ~InputMask.Drag;
				break;
			default:
				eventHandled = false;
				break;
		}

		this._keyboardDirection &= directionMask;
		if (!this._keyboardDirection) this._currentInput &= ~InputMask.Walk;
		if (eventHandled) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	public readInput(_: number): InputMask {
		return this._currentInput | this._keyboardDirection;
	}

	public removeListeners(): void {
		document.removeEventListener("keydown", this);
		document.removeEventListener("keyup", this);
	}
}

export default KeyboardInputManager;
