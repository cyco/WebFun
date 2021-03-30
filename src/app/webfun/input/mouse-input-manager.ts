import { InputManager, InputMask, Direction } from "src/engine/input";
import { Tile } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point, Direction as DirectionHelper, astar, MouseButton } from "src/util";
import { ZoneScene } from "src/engine/scenes";
import CursorManager from "./cursor-manager";
import { floor } from "src/std/math";
import PathUIScene from "./path-ui-scene";

enum MouseMode {
	Direction,
	Path
}

class MouseInputManager implements InputManager {
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

	public lastDirectionInput: number = performance.now();
	private readonly cursorManager: CursorManager;
	private _element: HTMLElement;
	private mouseMode: MouseMode = MouseMode.Direction;
	private _highlight = new PathUIScene();
	private pathTarget: Point;
	private _mouseDirection: number = 0;
	private _lastMouse: Point;
	private _currentInput: number;

	constructor(gameViewElement: HTMLElement, cursorManager: CursorManager) {
		this._element = gameViewElement;
		this.cursorManager = cursorManager;

		this._lastMouse = new Point(NaN, NaN);
		this._highlight.highlight = new Point(3, 2);
	}

	public clear(): void {}

	public addListeners(): void {
		document.addEventListener("mousemove", this);
		document.addEventListener("mousedown", this);
		document.addEventListener("mouseup", this);
		this.engine.addEventListener(Engine.Event.CurrentZoneChange, this);

		this.engine.sceneManager.addOverlay(this._highlight);
	}

	handleEvent(event: MouseEvent): void {
		if (
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement ||
			(event.target instanceof HTMLElement && event.target.hasAttribute("contenteditable"))
		) {
			return;
		}

		switch (event.type) {
			case Engine.Event.CurrentZoneChange: {
				this.pathTarget = null;
				this._highlight.highlight = null;
				this._highlight.target = null;
				break;
			}
			case "mouseup":
				return this._mouseUp(event as MouseEvent);
			case "mousedown":
				return this._mouseDown(event as MouseEvent);
			case "mousemove":
				return this._mouseMove(event as MouseEvent);
		}

		event.preventDefault();
		event.stopPropagation();
	}

	private _mouseDown(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		if (!this._element.contains(e.target as Node)) return;

		const point = this.convertClientCoordinatesToView(mouseLocation);
		const pointIsInView = point.x > 0 && point.y > 0 && point.x < 1 && point.y < 1;
		console.assert(pointIsInView, "Previous in-bounds check should have been sufficient");

		if (this.mouseDownHandler) this.mouseDownHandler(point);

		this._lastMouse = point;
		this.updateMouse();
		this.lastDirectionInput = performance.now();

		if (this.mouseMode === MouseMode.Direction) {
			if (e.button === MouseButton.Main) this._currentInput |= InputMask.Walk;
			if (e.button === MouseButton.Secondary) this._currentInput |= InputMask.Attack;
		} else {
			this.pathTarget = point.byScalingBy(9).floor().subtract(this.engine.camera.offset);
			this._highlight.target = this.pathTarget;
		}
	}

	private _mouseMove(e: MouseEvent) {
		const mouseLocation = new Point(e.clientX, e.clientY);
		const newMouse = this.convertClientCoordinatesToView(mouseLocation);
		if (newMouse.isEqualTo(this._lastMouse)) return;

		this._lastMouse = newMouse;
		this.updateMouse();
		this.lastDirectionInput = performance.now();
	}

	private updateMouse() {
		if (!this.engine.settings.lookTowardsMouse) return;

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
		if (e.button === MouseButton.Main) this._currentInput &= ~InputMask.Walk;
		if (e.button === MouseButton.Secondary) this._currentInput &= ~InputMask.Attack;

		this.lastDirectionInput = performance.now();
		this._mouseDirection = 0;
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
					(n1, n2) => n2p(n1).manhattanDistanceTo(n2p(n2)),
					n => n2p(n).manhattanDistanceTo(target)
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

		return this._mouseDirection | this._currentInput;
	}

	public removeListeners(): void {
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this);
		this.engine?.removeEventListener(Engine.Event.CurrentZoneChange, this);
		this.engine?.sceneManager.removeOverlay(this._highlight);
	}

	get mouseLocationInView(): Point {
		return this._lastMouse;
	}
}

export default MouseInputManager;
