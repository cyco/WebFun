import { Direction, InputMask, InputManager } from "src/engine/input";
import { KeyEvent, Point, Direction as DirectionHelper } from "src/util";
import { Engine } from "src/engine";

import { Tile } from "src/engine/objects";
import { document } from "src/std/dom";
import CursorManager from "./cursor-manager";
import { ZoneScene } from "src/engine/scenes";

class DesktopInputManager implements InputManager, EventListenerObject {
	public mouseDownHandler: (_: Point) => void = () => void 0;
	public keyDownHandler: (_: KeyboardEvent) => void = () => void 0;
	public currentItem: Tile;
	public engine: Engine;
	private _element: HTMLElement;
	private _lastMouse: Point;

	private preferKeyboard = false;
	private _mouseDirection: number = 0;
	private _keyboardDirection: number = 0;
	private readonly cursorManager: CursorManager;

	public placedTile: Tile;
	public placedTileLocation: Point;
	public pickUp: boolean;
	public scrollUp: boolean;
	public pause: boolean;
	public locator: boolean;
	public endDialog: boolean;
	public scrollDown: boolean;
	public attack: boolean;
	public walk: boolean;
	public drag: boolean;

	constructor(gameViewElement: HTMLElement, cursorManager: CursorManager) {
		this._element = gameViewElement;
		this._lastMouse = new Point(NaN, NaN);
		this.cursorManager = cursorManager;
	}

	get mouseLocationInView(): Point {
		return this._lastMouse;
	}

	public clear(): void {
		this.placedTileLocation = null;
		this.placedTile = null;
		this.locator = false;
		this.pause = false;
	}

	public addListeners() {
		document.addEventListener("keydown", this);
		document.addEventListener("keyup", this);
		document.addEventListener("mousemove", this);
		document.addEventListener("mousedown", this);
		document.addEventListener("mouseup", this);
		document.addEventListener("contextmenu", this);
	}

	public handleEvent(event: MouseEvent | KeyboardEvent) {
		if ("repeat" in event && event.repeat) return;
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		switch (event.type) {
			case "keydown":
				this.preferKeyboard = true;
				return this._keyDown(event as KeyboardEvent);
			case "keyup":
				this.preferKeyboard = true;
				return this._keyUp(event as KeyboardEvent);
			case "mouseup":
				this.preferKeyboard = false;
				return this._mouseUp(event as MouseEvent);
			case "mousedown":
				this.preferKeyboard = false;
				return this._mouseDown(event as MouseEvent);
			case "mousemove":
				this.preferKeyboard = false;
				return this._mouseMove(event as MouseEvent);
			case "contextmenu":
				event.stopPropagation();
				event.preventDefault();
		}
	}

	public removeListeners() {
		document.removeEventListener("keydown", this);
		document.removeEventListener("keyup", this);
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this);
		document.removeEventListener("contextmenu", this);
	}

	private _keyDown(e: KeyboardEvent) {
		let directionMask = 0;
		switch (e.which) {
			case KeyEvent.DOM_VK_UP:
				directionMask |= Direction.Up;
				this.scrollUp = true;
				break;
			case KeyEvent.DOM_VK_DOWN:
				this.scrollDown = true;
				directionMask |= Direction.Down;
				break;
			case KeyEvent.DOM_VK_LEFT:
				directionMask |= Direction.Left;
				break;
			case KeyEvent.DOM_VK_RIGHT:
				directionMask |= Direction.Right;
				break;
			case KeyEvent.DOM_VK_SPACE:
				this.attack = true;
				this.endDialog = true;
				this.pickUp = true;
				break;
			case KeyEvent.DOM_VK_SHIFT:
				this.drag = true;
				break;

			case KeyEvent.DOM_VK_P:
				this.pause = !this.pause;
				break;
			case KeyEvent.DOM_VK_L:
				this.locator = !this.locator;
				break;

			default:
				break;
		}

		this._keyboardDirection |= directionMask;
		if (this._keyboardDirection) this.walk = true;

		this.keyDownHandler(e);
	}

	private _keyUp(e: KeyboardEvent) {
		let mask = 0xff;

		switch (e.which) {
			case KeyEvent.DOM_VK_UP:
				mask = ~Direction.Up;
				this.scrollUp = false;
				break;
			case KeyEvent.DOM_VK_DOWN:
				mask &= ~Direction.Down;
				this.scrollDown = false;
				break;
			case KeyEvent.DOM_VK_LEFT:
				mask &= ~Direction.Left;
				break;
			case KeyEvent.DOM_VK_RIGHT:
				mask &= ~Direction.Right;
				break;
			case KeyEvent.DOM_VK_SPACE:
				this.attack = false;
				this.endDialog = false;
				this.pickUp = false;
				break;
			case KeyEvent.DOM_VK_SHIFT:
				this.drag = false;
				break;

			default:
				break;
		}

		this._keyboardDirection &= mask;
		if (!this._keyboardDirection) this.walk = false;
	}

	private _mouseDown(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		if (!this._element.contains(e.target as Node)) return;

		const point = this.convertClientCoordinatesToView(mouseLocation);
		const pointIsInView = point.x > 0 && point.y > 0 && point.x < 1 && point.y < 1;
		console.assert(pointIsInView, "Previous in-bounds check should have been sufficient");

		if (e.button === 0) this.walk = true;
		if (e.button === 1) this.attack = true;

		this.mouseDownHandler(point);
	}

	private _mouseMove(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		this._lastMouse = this.convertClientCoordinatesToView(mouseLocation);

		const [dir, angle] = this.calculateDirectionFromHero(this._lastMouse);
		this._mouseDirection = dir;
		this._updateCursor(dir, angle);
	}

	private _directionInputFromAngle(input: Point): number {
		let result = 0;

		if (input.x < 0) result |= Direction.Left;
		if (input.x > 0) result |= Direction.Right;
		if (input.y < 0) result |= Direction.Up;
		if (input.y > 0) result |= Direction.Down;

		return result;
	}

	private _mouseUp(e: MouseEvent) {
		if (e.button === 0) this.walk = false;
		if (e.button === 1) this.attack = false;

		this._keyboardDirection = 0;
		this._mouseDirection = 0;
		this.preferKeyboard = false;
	}

	public readInput(_: number): InputMask {
		let result = InputMask.None;

		if (this.pause) result |= InputMask.Pause;
		if (this.locator) result |= InputMask.Locator;

		if (this.endDialog) result |= InputMask.EndDialog;
		if (this.scrollDown) result |= InputMask.ScrollDown;
		if (this.scrollUp) result |= InputMask.ScrollUp;

		const directions = this.directions;
		if (directions & Direction.Left) result |= InputMask.Left;
		if (directions & Direction.Up) result |= InputMask.Up;
		if (directions & Direction.Down) result |= InputMask.Down;
		if (directions & Direction.Right) result |= InputMask.Right;
		if (this.walk) result |= InputMask.Walk;
		if (this.drag) result |= InputMask.Drag;
		if (this.attack) result |= InputMask.Attack;

		return result;
	}

	private get directions() {
		return this.preferKeyboard ? this._keyboardDirection : this._mouseDirection;
	}

	private convertClientCoordinatesToView(location: Point): Point {
		const boundingRect = this._element.getBoundingClientRect();
		const viewOffset = new Point(boundingRect.left, boundingRect.top);

		return Point.subtract(location, viewOffset).dividedBy(boundingRect);
	}

	private calculateDirectionFromHero(location: Point): [number, number] {
		const engine = this.engine;
		if (!engine) return [0, null];
		const mouseLocationInView = location;

		const camera = engine.camera;
		const offset = camera.offset;
		const size = camera.size;
		const hero = engine.hero;

		const mouseLocationOnZone = new Point(
			mouseLocationInView.x * size.width - offset.x - 0.5,
			mouseLocationInView.y * size.height - offset.y - 0.5
		);

		const relativeLocation = Point.subtract(mouseLocationOnZone, hero.location);

		const onHero = Math.abs(relativeLocation.x) < 0.5 && Math.abs(relativeLocation.y) < 0.5;
		const closeToViewEdge =
			mouseLocationInView.x < 1 / 18 ||
			mouseLocationInView.y < 1 / 18 ||
			mouseLocationInView.x > 17 / 18 ||
			mouseLocationInView.y > 17 / 18;
		if (!onHero || closeToViewEdge) {
			const direction = DirectionHelper.Confine(
				DirectionHelper.CalculateAngleFromRelativePoint(relativeLocation)
			);
			if (isNaN(direction)) {
				return [0, null];
			}

			const angle = DirectionHelper.CalculateRelativeCoordinates(direction, 1);

			return [this._directionInputFromAngle(angle), direction];
		} else {
			return [0, null];
		}
	}

	private _updateCursor(direction: number, angle: number) {
		if (
			this.engine &&
			(!(this.engine.sceneManager.currentScene instanceof ZoneScene) || !this.engine.hero.visible)
		) {
			this.cursorManager.changeCursor(null);
			return;
		}

		if (angle === null) {
			this.cursorManager.changeCursor("block");
		} else {
			this.cursorManager.changeCursor(angle);
		}
	}
}

export default DesktopInputManager;
