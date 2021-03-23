import InputManager from "src/app/webfun/input/input-manager";
import { InputMask } from "src/engine/input";
import { MouseButton, Point, Size } from "src/util";
import CursorManager from "src/app/webfun/input/cursor-manager";
import { OnscreenButton, OnscreenPad } from "src/app/webfun/ui";

describe("WebFun.App.Input.InputManager", () => {
	let subject: InputManager;
	let element: HTMLDivElement;
	let mockElement: HTMLDivElement;
	let mockedCursorManager: CursorManager;
	let mockOnscreenAttackButton: OnscreenButton;
	let mockOnscreenDragButton: OnscreenButton;
	let mockOnscreenPad: OnscreenPad;

	beforeAll(() => {
		mockOnscreenAttackButton = {} as any;
		mockOnscreenDragButton = {} as any;
		mockOnscreenPad = { lastInput: 0 } as any;
		mockedCursorManager = { changeCursor: (): void => void 0 } as any;
		element = document.createElement("div");
		subject = new InputManager(
			element,
			mockedCursorManager,
			mockOnscreenPad,
			mockOnscreenDragButton,
			mockOnscreenAttackButton
		);
		subject.engine = {
			hero: { location: new Point(0, 0) },
			sceneManager: {
				addOverlay() {},
				removeOverlay() {}
			},
			camera: { offset: new Point(0, 0), size: new Size(288, 288) },
			variant: { mapKey: "KeyL" },
			addEventListener() {},
			removeEventListener() {}
		} as any;
		mockElement = {} as any;
		spyOn(element, "contains").and.callFake(e => e === mockElement);
	});

	describe("keyboard input", () => {
		beforeEach(() => subject.addListeners());
		afterEach(() => {
			releaseAllKeys();
			subject.removeListeners();
		});

		it("toggles locator when the l-key is pressed", () => {
			mockKeyboardEvent("KeyL", true);
			expect(subject.readInput(0) & InputMask.Map).toBeTruthy();

			mockKeyboardEvent("KeyL", true);
			expect(subject.readInput(0) & InputMask.Map).toBeFalsy();

			mockKeyboardEvent("KeyL", true);
			expect(subject.readInput(0) & InputMask.Map).toBeTruthy();
		});

		it("toggles pause when the p-key is pressed", () => {
			mockKeyboardEvent("KeyP", true);
			expect(subject.readInput(0) & InputMask.Pause).toBeTruthy();

			mockKeyboardEvent("KeyP", true);
			expect(subject.readInput(0) & InputMask.Pause).toBeFalsy();

			mockKeyboardEvent("KeyP", true);
			expect(subject.readInput(0) & InputMask.Pause).toBeTruthy();
		});

		it("activates dragging while shift key is pressed", () => {
			mockKeyboardEvent("ShiftLeft", true);
			expect(subject.readInput(0) & InputMask.Drag).toBeTruthy();
			mockKeyboardEvent("ShiftLeft", true);
			expect(subject.readInput(0) & InputMask.Drag).toBeTruthy();

			mockKeyboardEvent("ShiftLeft", false);
			expect(subject.readInput(0) & InputMask.Drag).toBeFalsy();
		});

		it("keeps track of directional input", () => {
			mockKeyboardEvent("ArrowUp", true);
			expect(subject.readInput(0) & InputMask.Up).toBeTruthy();
			mockKeyboardEvent("ArrowDown", true);
			expect(subject.readInput(0) & InputMask.Down).toBeTruthy();
			mockKeyboardEvent("ArrowLeft", true);
			expect(subject.readInput(0) & InputMask.Left).toBeTruthy();
			mockKeyboardEvent("ArrowRight", true);
			expect(subject.readInput(0) & InputMask.Right).toBeTruthy();
			expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();

			mockKeyboardEvent("ArrowUp", false);
			expect(subject.readInput(0) & InputMask.Up).toBeFalsy();
			mockKeyboardEvent("ArrowDown", false);
			expect(subject.readInput(0) & InputMask.Down).toBeFalsy();
			mockKeyboardEvent("ArrowLeft", false);
			expect(subject.readInput(0) & InputMask.Left).toBeFalsy();
			mockKeyboardEvent("ArrowRight", false);
			expect(subject.readInput(0) & InputMask.Right).toBeFalsy();
			expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
		});

		it("accepts WASD input ", () => {
			mockKeyboardEvent("KeyW", true);
			expect(subject.readInput(0) & InputMask.Up).toBeTruthy();
			mockKeyboardEvent("KeyS", true);
			expect(subject.readInput(0) & InputMask.Down).toBeTruthy();
			mockKeyboardEvent("KeyA", true);
			expect(subject.readInput(0) & InputMask.Left).toBeTruthy();
			mockKeyboardEvent("KeyD", true);
			expect(subject.readInput(0) & InputMask.Right).toBeTruthy();
			expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();

			mockKeyboardEvent("KeyW", false);
			expect(subject.readInput(0) & InputMask.Up).toBeFalsy();
			mockKeyboardEvent("KeyS", false);
			expect(subject.readInput(0) & InputMask.Down).toBeFalsy();
			mockKeyboardEvent("KeyA", false);
			expect(subject.readInput(0) & InputMask.Left).toBeFalsy();
			mockKeyboardEvent("KeyD", false);
			expect(subject.readInput(0) & InputMask.Right).toBeFalsy();
			expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
		});

		it("tracks the 'attack' key", () => {
			const attackKey = "Space";
			mockKeyboardEvent(attackKey, true);
			expect(subject.readInput(0) & InputMask.Attack).toBeTruthy();
			mockKeyboardEvent(attackKey, false);
			expect(subject.readInput(0) & InputMask.Attack).toBeFalsy();
		});

		it("tracks the 'end dialog' key", () => {
			const endDialogKey = "Space";
			mockKeyboardEvent(endDialogKey, true);
			expect(subject.readInput(0) & InputMask.EndDialog).toBeTruthy();
		});

		it("maps up-key presses to scrollUp", () => {
			const scrollUpKey = "ArrowUp";
			mockKeyboardEvent(scrollUpKey, true);
			expect(subject.readInput(0) & InputMask.ScrollUp).toBeTruthy();
		});

		it("maps down-key presses to scrollDown", () => {
			const scrollDownKey = "ArrowDown";
			mockKeyboardEvent(scrollDownKey, true);
			expect(subject.readInput(0) & InputMask.ScrollDown).toBeTruthy();
		});

		it("tracks the 'pick up' key", () => {
			const pickUpKey = "Space";
			mockKeyboardEvent(pickUpKey, true);
			expect(subject.readInput(0) & InputMask.PickUp).toBeTruthy();
		});

		it("ignores unknown keys", () => {
			expect(() => {
				mockKeyboardEvent("KeyO", true);
				mockKeyboardEvent("KeyZ", false);
			}).not.toThrow();
		});

		it("does not react to keyboard events after being deactivated", () => {
			let event: any = new CustomEvent("keydown");
			event.code = "Space";
			document.dispatchEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).toBeTruthy();

			event = new CustomEvent("keyup");
			event.code = "Space";
			document.dispatchEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).toBeFalsy();

			subject.removeListeners();
			event = new CustomEvent("keydown");
			event.code = "Space";
			document.dispatchEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();
		});

		it("ignores repeated keyboard events", () => {
			(subject as any).keyboardInputManager._currentInput = InputMask.None;
			const event: any = {
				type: "keydown",
				code: "Space",
				repeat: true,
				stopPropagation: jasmine.createSpy(),
				preventDefault: jasmine.createSpy()
			};

			(subject as any).keyboardInputManager.handleEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();
		});

		it("ignores keyboard events that are sent to an input element", () => {
			let event: any = {
				type: "keydown",
				code: "Space",
				repeat: true,
				stopPropagation: jasmine.createSpy(),
				preventDefault: jasmine.createSpy(),
				target: document.createElement("input")
			};

			subject.handleEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();

			(subject as any).keyboardInputManager._currentInput = InputMask.None;
			event = {
				type: "keydown",
				code: "Space",
				target: document.createElement("textarea"),
				stopPropagation: jasmine.createSpy(),
				preventDefault: jasmine.createSpy()
			};

			(subject as any).keyboardInputManager.handleEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();
		});
	});

	describe("contextmenu event", () => {
		beforeEach(() => subject.addListeners());
		afterEach(() => subject.removeListeners());

		it("overrides the browsers context menu if the click occurred in a scene view", () => {
			const event: any = {
				type: "contextmenu",
				preventDefault() {},
				stopPropagation() {},
				target: element
			};
			spyOn(event, "preventDefault");
			subject.handleEvent(event);
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe("mouse events", () => {
		beforeEach(() => {
			element.style.width = "288px";
			element.style.height = "288px";
			element.style.position = "absolute";
			element.style.left = "10px";
			element.style.top = "10px";

			document.body.appendChild(element);
			subject.addListeners();
		});

		it("tracks the mouse location in view coordinates", () => {
			fakeMouse("move", { x: 0, y: 0 });
			expect(subject.mouseLocationInView.x).toBeLessThan(0);
			expect(subject.mouseLocationInView.y).toBeLessThan(0);

			fakeMouse("move", { x: 10, y: 0 });
			expect(subject.mouseLocationInView.x).toBe(0);
			expect(subject.mouseLocationInView.y).toBeLessThan(0);

			fakeMouse("move", { x: 10, y: 10 });
			expect(subject.mouseLocationInView.x).toBe(0);
			expect(subject.mouseLocationInView.y).toBe(0);

			fakeMouse("move", { x: 298, y: 298 });
			expect(subject.mouseLocationInView.x).toBe(1);
			expect(subject.mouseLocationInView.y).toBe(1);

			fakeMouse("move", { x: 10 + 288 / 2, y: 10 + 288 / 2 });
			expect(subject.mouseLocationInView.x).toBe(0.5);
			expect(subject.mouseLocationInView.y).toBe(0.5);
		});

		describe("when the left mouse is pressed inside the element", () => {
			beforeEach(() => fakeMouse("down", { x: 15, y: 15, button: MouseButton.Main }));

			it("starts walking", () => {
				expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();
			});

			describe("and the right button is released", () => {
				beforeEach(() => fakeMouse("up", { x: 10, y: 10, button: MouseButton.Secondary }));

				it("does not stop walking", () => {
					expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();
				});
			});

			describe("and it is released", () => {
				beforeEach(() => fakeMouse("up", { x: 10, y: 10, button: MouseButton.Main }));

				it("stops walking", () => {
					expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
				});
			});
		});

		describe("when the left mouse is pressed outside the element", () => {
			beforeEach(() => {
				(subject as any).mouseInputManager._currentInput = InputMask.None;
				fakeMouse("down", { x: 0, y: 0, button: MouseButton.Main }, {});
			});

			it("start does not initiate walking", () => {
				expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
			});
		});

		describe("when the right mouse is pressed inside the element", () => {
			beforeEach(() => fakeMouse("down", { x: 15, y: 15, button: MouseButton.Secondary }));

			it("starts attacking", () => {
				expect(subject.readInput(0) & InputMask.Attack).toBeTruthy();
			});

			describe("and it is released", () => {
				beforeEach(() => fakeMouse("up", { x: 0, y: 0, button: MouseButton.Secondary }));

				it("stops attacking", () => {
					expect(subject.readInput(0) & InputMask.Attack).toBeFalsy();
				});
			});
		});

		it("are ignored if only triggered because of modifier changes", () => {
			mockKeyboardEvent("ShiftLeft", true);
			fakeMouse("move", { x: 140, y: 280, shiftKey: true });
			mockKeyboardEvent("KeyW", true);

			mockKeyboardEvent("ShiftLeft", false);
			fakeMouse("move", { x: 140, y: 280, shiftKey: false });
			expect(subject.readInput(0) & InputMask.Up).toBeTruthy();
		});

		afterEach(() => {
			element.remove();
			subject.removeListeners();
		});

		describe("`clear` method", () => {
			it("is called when a placeTile event has been handled and resets related variables", () => {
				subject.placedTileLocation = new Point(4, 3);
				(subject as any).placedTile = {};

				subject.clear();

				expect(subject.placedTileLocation).toBeNull();
				expect(subject.placedTile).toBeNull();
			});
		});
	});

	function releaseAllKeys() {
		[
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"ShiftLeft",
			"Space",
			"KeyP",
			"KeyL",
			"KeyW",
			"KeyA",
			"KeyS",
			"KeyD"
		].forEach(k => mockKeyboardEvent(k, false));
	}

	function mockKeyboardEvent(code: string, pressed: boolean) {
		const event: any = new CustomEvent(pressed ? "keydown" : "keyup");
		event.code = code;
		event.repeat = false;
		(subject as any).keyboardInputManager.handleEvent(event);
	}

	function fakeMouse(type: string, options: any, target: any = mockElement) {
		const event: any = { type: "mouse" + type };
		event.clientX = options.x;
		event.clientY = options.y;
		event.button = options.button;
		event.target = target;
		(subject as any).mouseInputManager.handleEvent(event);
	}
});
