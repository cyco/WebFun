import { KeyEvent, Point } from "src/util";
import InputManager, { Direction } from "./input-manager";
import Engine from "../engine";

class DesktopInputManager extends InputManager {
	private _element: HTMLElement;
	private _lastMouse: Point;
	private _engine: Engine;

	constructor(gameViewElement: HTMLElement) {
		super();

		this._element = gameViewElement;
		this._lastMouse = new Point(NaN, NaN);
	}

	get engine(): Engine {
		return this._engine;
	}

	set engine(engine: Engine) {
		this._engine = engine;
	}

	get mouseLocationInView(): Point {
		return this._lastMouse;
	}

	addListeners() {
		document.addEventListener("keydown", this.keyDown.bind(this));
		document.addEventListener("keyup", this.keyUp.bind(this));
		document.addEventListener("mousemove", this.mouseMove.bind(this));
		document.addEventListener("mousedown", this.mouseDown.bind(this));
		document.addEventListener("mouseup", this.mouseUp.bind(this));
		document.addEventListener("contextmenu", (event) => event.preventDefault());
	}

	removeListeners() {
		document.removeEventListener("keydown", this.keyDown.bind(this));
		document.removeEventListener("keyup", this.keyUp.bind(this));
		document.removeEventListener("mousemove", this.mouseMove.bind(this));
		document.removeEventListener("mousedown", this.mouseDown.bind(this));
		document.removeEventListener("mouseup", this.mouseUp.bind(this));
		document.removeEventListener("contextmenu", (event) => event.preventDefault());
	}

	keyDown(e: KeyEvent) {
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
		if (this._direction)
			this._walk = true;

		if (this.keyDownHandler instanceof Function) {
			this.keyDownHandler(e);
		}
	}

	keyUp(e: KeyEvent) {
		let mask = 0xFF;

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
		if (!this._direction)
			this._walk = false;
	}

	mouseDown(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		const point = this._getPointInViewCoordinates(mouseLocation);
		const pointIsInView = point.x > 0 && point.y > 0 && point.x < 1 && point.y < 1;
		if (!pointIsInView)
			return;

		if (e.button === 0)
			this._walk = true;
		if (e.button === 1)
			this._attack = true;

		if (this.mouseDownHandler instanceof Function) {
			this.mouseDownHandler(point);
		}
	}

	mouseMove(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		this._lastMouse = this._getPointInViewCoordinates(mouseLocation);
	}

	mouseUp(e: MouseEvent) {
		if (e.button === 0)
			this._walk = false;
		if (e.button === 1)
			this._attack = false;
	}

	_getPointInViewCoordinates(location: Point): Point {
		const boundingRect = this._element.getBoundingClientRect();
		const viewOffset = new Point(boundingRect.left, boundingRect.top);

		let point = Point.subtract(location, viewOffset);
		point.x /= boundingRect.width;
		point.y /= boundingRect.height;
		return point;
	}
}

export default DesktopInputManager;
