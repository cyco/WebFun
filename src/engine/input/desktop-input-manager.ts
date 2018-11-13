import { KeyEvent, Point } from "src/util";
import InputManager, { Direction } from "./input-manager";
import { SceneView } from "src/app/ui";
import { document } from "src/std/dom";

class DesktopInputManager extends InputManager implements EventListenerObject {
	private _element: HTMLElement;
	private _lastMouse: Point;

	constructor(gameViewElement: HTMLElement) {
		super();

		this._element = gameViewElement;
		this._lastMouse = new Point(NaN, NaN);
	}

	get mouseLocationInView(): Point {
		return this._lastMouse;
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
		switch (event.type) {
			case "keydown":
				return this._keyDown(event as KeyboardEvent);
			case "keyup":
				return this._keyUp(event as KeyboardEvent);
			case "mouseup":
				return this._mouseUp(event as MouseEvent);
			case "mousedown":
				return this._mouseDown(event as MouseEvent);
			case "mousemove":
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
				this._attack = true;
				this.endDialog = true;
				this.pickUp = true;
				break;
			case KeyEvent.DOM_VK_SHIFT:
				this._drag = true;
				break;

			case KeyEvent.DOM_VK_P: // toggle pause
				this.pause = !this.pause;
				break;
			case KeyEvent.DOM_VK_L: // toggle map, must be reset if locator is not available
				this.locator = !this.locator;
				break;

			default:
				break;
		}

		this._direction |= directionMask;
		if (this._direction) this._walk = true;

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
				this._attack = false;
				this.endDialog = false;
				this.pickUp = false;
				break;
			case KeyEvent.DOM_VK_SHIFT:
				this._drag = false;
				break;

			default:
				break;
		}

		this._direction &= mask;
		if (!this._direction) this._walk = false;
	}

	private _mouseDown(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);

		const element = document.elementFromPoint(mouseLocation.x, mouseLocation.y);
		// HACK: this is a cheap way way to find out if scene view is front most
		if (!element.closest(SceneView.tagName)) return;

		const point = this._getPointInViewCoordinates(mouseLocation);
		const pointIsInView = point.x > 0 && point.y > 0 && point.x < 1 && point.y < 1;
		if (!pointIsInView) return;

		if (e.button === 0) this._walk = true;
		if (e.button === 1) this._attack = true;

		this.mouseDownHandler(point);
	}

	private _mouseMove(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		this._lastMouse = this._getPointInViewCoordinates(mouseLocation);
	}

	private _mouseUp(e: MouseEvent) {
		if (e.button === 0) this._walk = false;
		if (e.button === 1) this._attack = false;
	}

	private _getPointInViewCoordinates(location: Point): Point {
		const boundingRect = this._element.getBoundingClientRect();
		const viewOffset = new Point(boundingRect.left, boundingRect.top);

		return Point.subtract(location, viewOffset).dividedBy(boundingRect);
	}
}

export default DesktopInputManager;
