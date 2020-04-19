import { Direction, InputMask, InputManager } from "src/engine/input";
import { KeyEvent, Point, Direction as DirectionHelper, astar } from "src/util";
import { Engine } from "src/engine";

import { Tile } from "src/engine/objects";
import { document } from "src/std/dom";
import CursorManager from "./cursor-manager";
import { ZoneScene } from "src/engine/scenes";
import PathUIScene from "./path-ui-scene";
import { floor } from "src/std/math";
import Settings from "src/settings";
import KeyboardInputManager from "./keyboard-input-manager";
import MouseInputManager from "./mouse-input-manager";
import OnscreenInputManager from "./onscreen-input-manager";

enum MouseMode {
	Direction,
	Path
}

class DesktopInputManager implements InputManager, EventListenerObject {
	private keyboardInputManager: KeyboardInputManager;
	private mouseInputManager: MouseInputManager;
	private onscreenInputManager: OnscreenInputManager;
	private inputManagers: InputManager[];

	public mouseDownHandler: (_: Point) => void = () => void 0;
	public keyDownHandler: (_: KeyboardEvent) => void = () => void 0;
	public currentItem: Tile;
	private _engine: Engine;
	private _element: HTMLElement;
	private _lastMouse: Point;

	private _mouseDirection: number = 0;
	private _currentInput: InputMask = InputMask.None;
	private readonly cursorManager: CursorManager;
	public lastDirectionInput: number = performance.now();

	public placedTile: Tile = null;
	public placedTileLocation: Point = null;
	private _highlight = new PathUIScene();
	private mouseMode: MouseMode = MouseMode.Direction;
	private pathTarget: Point;

	constructor(gameViewElement: HTMLElement, cursorManager: CursorManager) {
		this._element = gameViewElement;
		this._lastMouse = new Point(NaN, NaN);
		this.cursorManager = cursorManager;

		this._highlight.highlight = new Point(3, 2);

		this.keyboardInputManager = new KeyboardInputManager();
		this.mouseInputManager = new MouseInputManager();
		this.onscreenInputManager = new OnscreenInputManager();

		this.inputManagers = [this.keyboardInputManager, this.mouseInputManager, this.onscreenInputManager];
	}

	get mouseLocationInView(): Point {
		return this._lastMouse;
	}

	public clear(): void {
		this.placedTileLocation = null;
		this.placedTile = null;

		this._currentInput &= ~InputMask.Locator;
		this._currentInput &= ~InputMask.Pause;

		this.inputManagers.forEach(i => i.clear());
	}

	public addListeners() {
		document.addEventListener("mousemove", this);
		document.addEventListener("mousedown", this);
		document.addEventListener("mouseup", this);
		document.addEventListener("contextmenu", this);

		this.engine.addEventListener(Engine.Event.CurrentZoneChange, this);
		this.engine.sceneManager.addOverlay(this._highlight);

		this.inputManagers.forEach(i => i.addListeners());
	}

	public handleEvent(event: MouseEvent) {
		if (event.type === Engine.Event.CurrentZoneChange) {
			this.pathTarget = null;
			this._highlight.highlight = null;
			this._highlight.target = null;
			return;
		}

		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		switch (event.type) {
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
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this);
		document.removeEventListener("contextmenu", this);

		this.engine.removeEventListener(Engine.Event.CurrentZoneChange, this);
		this.engine.sceneManager.removeOverlay(this._highlight);

		this.inputManagers.forEach(i => i.removeListeners());
	}

	private _mouseDown(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		if (!this._element.contains(e.target as Node)) return;

		const point = this.convertClientCoordinatesToView(mouseLocation);
		const pointIsInView = point.x > 0 && point.y > 0 && point.x < 1 && point.y < 1;
		console.assert(pointIsInView, "Previous in-bounds check should have been sufficient");

		this._lastMouse = point;
		this.updateMouse();
		this.lastDirectionInput = performance.now();

		if (this.mouseMode === MouseMode.Direction) {
			if (e.button === 0) this._currentInput |= InputMask.Walk;
			if (e.button === 1) this._currentInput |= InputMask.Attack;
		} else {
			this.pathTarget = point.byScalingBy(9).floor().subtract(this.engine.camera.offset);
			this._highlight.target = this.pathTarget;
		}

		this.mouseDownHandler(point);
	}

	private _mouseMove(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		this._lastMouse = this.convertClientCoordinatesToView(mouseLocation);
		this.updateMouse();
		this.lastDirectionInput = performance.now();
	}

	private updateMouse() {
		if (!Settings.lookTowardsMouse) return;

		const [dir, angle] = this.calculateDirectionFromHero(this._lastMouse);
		this._mouseDirection = dir;

		if (this.mouseMode === MouseMode.Direction) {
			this._updateCursor(dir, angle);
		} else {
			this.cursorManager.changeCursor(null);
			this._highlight.highlight = new Point(this._lastMouse.x, this._lastMouse.y);
		}
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
		if (e.button === 0) this._currentInput &= ~InputMask.Walk;
		if (e.button === 1) this._currentInput &= ~InputMask.Attack;

		this.lastDirectionInput = performance.now();
		this._mouseDirection = 0;
	}

	public readInput(_: number): InputMask {
		if (this.pathTarget) {
			const zone = this.engine.currentZone;
			const source = this.engine.hero.location;
			const target = this.pathTarget;

			if (source.isEqualTo(target)) {
				this.pathTarget = null;
				return InputMask.None;
			}

			const p2n = (p: Point): number => p.x + p.y * zone.size.width;
			const n2p = (n: number): Point => new Point(n % zone.size.width, floor(n / zone.size.width));
			const path =
				astar(
					p2n(source),
					p2n(target),
					node =>
						[
							n2p(node).byAdding(-1, -1),
							n2p(node).byAdding(0, -1),
							n2p(node).byAdding(1, -1),
							n2p(node).byAdding(-1, 0),
							n2p(node).byAdding(1, 0),
							n2p(node).byAdding(-1, 1),
							n2p(node).byAdding(0, 1),
							n2p(node).byAdding(1, 1)
						]
							.filter(
								p => (zone.bounds.contains(p) && zone.placeWalkable(p)) || p.isEqualTo(target)
							)
							.map(p2n),
					(n1, n2) => n2p(n1).manhattenDistanceTo(n2p(n2)),
					n => n2p(n).manhattenDistanceTo(target)
				) ?? [];

			path.shift();

			const nextStep = n2p(path.shift());
			let direction = InputMask.Walk;

			if (nextStep.x < source.x) {
				direction |= InputMask.Left;
			} else if (nextStep.x > source.x) {
				direction |= InputMask.Right;
			}

			if (nextStep.y < source.y) {
				direction |= InputMask.Up;
			} else if (nextStep.y > source.y) {
				direction |= InputMask.Down;
			}

			if (path.length === 0) {
				this.pathTarget = null;
			}

			return direction;
		}

		const walk =
			(this.keyboardInputManager.lastDirectionInput > this.lastDirectionInput
				? this.keyboardInputManager._currentInput
				: this._currentInput) & InputMask.Walk;

		return ((this._currentInput | this.preferredDirections) & ~InputMask.Walk) | walk;
	}

	private get preferredDirections() {
		if (this.keyboardInputManager.lastDirectionInput > this.lastDirectionInput) {
			return this.keyboardInputManager._keyboardDirection;
		}

		return this._mouseDirection;
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

	set engine(e: Engine) {
		this._engine = e;
		this.inputManagers.forEach(im => (im.engine = e));
	}

	get engine() {
		return this._engine;
	}
}

export default DesktopInputManager;
