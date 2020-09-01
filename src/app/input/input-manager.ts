import { InputMask, InputManager as InputManagerInterface } from "src/engine/input";
import { Point } from "src/util";
import { Engine } from "src/engine";

import { Tile } from "src/engine/objects";
import CursorManager from "./cursor-manager";
import KeyboardInputManager from "./keyboard-input-manager";
import MouseInputManager from "./mouse-input-manager";
import OnscreenInputManager from "./onscreen-input-manager";
import { OnscreenPad, OnscreenButton } from "src/app/ui";

class InputManager implements InputManagerInterface, EventListenerObject {
	public currentItem: Tile;
	public placedTile: Tile = null;
	public placedTileLocation: Point = null;

	private keyboardInputManager: KeyboardInputManager;
	private mouseInputManager: MouseInputManager;
	private onscreenInputManager: OnscreenInputManager;
	private inputManagers: InputManagerInterface[];
	private _engine: Engine;
	private gameViewElement: HTMLElement;

	constructor(
		gameViewElement: HTMLElement,
		cursorManager: CursorManager,
		pad: OnscreenPad,
		shoot: OnscreenButton,
		drag: OnscreenButton
	) {
		this.gameViewElement = gameViewElement;

		this.keyboardInputManager = new KeyboardInputManager();
		this.mouseInputManager = new MouseInputManager(gameViewElement, cursorManager);
		this.onscreenInputManager = new OnscreenInputManager(gameViewElement, pad, shoot, drag);

		this.inputManagers = [this.keyboardInputManager, this.mouseInputManager, this.onscreenInputManager];
	}

	get mouseLocationInView(): Point {
		return this.mouseInputManager.mouseLocationInView;
	}

	public clear(): void {
		this.placedTileLocation = null;
		this.placedTile = null;

		this.inputManagers.forEach(i => i.clear());
	}

	public addListeners() {
		this.gameViewElement.addEventListener("contextmenu", this);
		this.inputManagers.forEach(i => i.addListeners());
	}

	public handleEvent(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
	}

	public removeListeners() {
		this.gameViewElement.removeEventListener("contextmenu", this);
		this.inputManagers.forEach(i => i.removeListeners());
	}

	public readInput(ticks: number): InputMask {
		const keyboardInput = this.keyboardInputManager.readInput(ticks);
		const lastKeyboardInput = this.keyboardInputManager.lastDirectionInput;
		const onscreenInput = this.onscreenInputManager.readInput(ticks);
		const lastOnscreenInput = this.onscreenInputManager.lastDirectionInput;
		const mouseInput = this.mouseInputManager.readInput(ticks);
		const lastMouseInput = this.mouseInputManager.lastDirectionInput;
		let directionInput = 0;

		if (lastKeyboardInput > lastOnscreenInput) {
			if (lastKeyboardInput > lastMouseInput) {
				directionInput = keyboardInput & InputMask.Movement;
			} else {
				directionInput = mouseInput & InputMask.Movement;
			}
		} else if (lastOnscreenInput > lastMouseInput) {
			directionInput = onscreenInput & InputMask.Movement;
		} else {
			directionInput = mouseInput & InputMask.Movement;
		}

		return (
			(keyboardInput & ~InputMask.Movement) |
			(onscreenInput & ~InputMask.Movement) |
			(mouseInput & ~InputMask.Movement) |
			directionInput
		);
	}

	set engine(e: Engine) {
		this._engine = e;
		this.inputManagers.forEach(im => (im.engine = e));
	}

	get engine() {
		return this._engine;
	}

	public set mouseDownHandler(h: (_: Point) => void) {
		this.inputManagers.forEach(i => (i.mouseDownHandler = h));
	}

	public get mouseDownHandler() {
		return this.inputManagers.first().mouseDownHandler;
	}

	public set keyDownHandler(h: (_: KeyboardEvent) => void) {
		this.inputManagers.forEach(i => (i.keyDownHandler = h));
	}

	public get keyDownHandler() {
		return this.inputManagers.first().keyDownHandler;
	}
}

export default InputManager;
