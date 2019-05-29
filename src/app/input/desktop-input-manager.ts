import { Direction, InputManager } from "src/engine/input";
import { KeyEvent, Point, Rectangle, Size } from "src/util";
import { Engine } from "src/engine";

import { Tile } from "src/engine/objects";
import { document } from "src/std/dom";

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

	constructor(gameViewElement: HTMLElement) {
		this._element = gameViewElement;
		this._lastMouse = new Point(NaN, NaN);
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

		// HACK: this is a cheap way way to find out if scene view is front most
		const sceneView = this._element;
		const { left, top, width, height } = sceneView.getBoundingClientRect();
		if (!new Rectangle(new Point(left, top), new Size(width, height)).contains(mouseLocation)) {
			return;
		}

		const point = this._getPointInViewCoordinates(mouseLocation);
		const pointIsInView = point.x > 0 && point.y > 0 && point.x < 1 && point.y < 1;
		console.assert(pointIsInView, "Previous in-bounds check should have been sufficient");

		if (e.button === 0) this.walk = true;
		if (e.button === 1) this.attack = true;

		this.mouseDownHandler(point);
	}

	private _mouseMove(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		this._lastMouse = this._getPointInViewCoordinates(mouseLocation);
	}

	private _mouseUp(e: MouseEvent) {
		if (e.button === 0) this.walk = false;
		if (e.button === 1) this.attack = false;
	}

	get directions() {
		return this.preferKeyboard ? this._keyboardDirection : this._mouseDirection;
	}

	private _getPointInViewCoordinates(location: Point): Point {
		const boundingRect = this._element.getBoundingClientRect();
		const viewOffset = new Point(boundingRect.left, boundingRect.top);

		return Point.subtract(location, viewOffset).dividedBy(boundingRect);
	}
}

export default DesktopInputManager;
