import DesktopInputManager from "src/app/input/desktop-input-manager";
import { InputMask } from "src/engine/input";
import { KeyEvent, Point, Size } from "src/util";
import CursorManager from "src/app/input/cursor-manager";

describe("WebFun.App.Input.DesktopInputManager", () => {
	let subject: DesktopInputManager;
	let element: HTMLDivElement;
	let mockElement: HTMLDivElement;
	let mockedCursorManager: CursorManager;

	beforeAll(() => {
		mockedCursorManager = { changeCursor: (): void => void 0 } as any;
		element = document.createElement("div");
		subject = new DesktopInputManager(element, mockedCursorManager);
		subject.engine = {
			sceneManager: { addOverlay() {}, removeOverlay() {} },
			camera: { offset: new Point(0, 0), size: new Size(288, 288) }
		} as any;
		mockElement = {} as any;
		spyOn(element, "contains").and.callFake(e => e === mockElement);
	});

	it("collects game input from keyboard and mouse", () => {
		expect((subject as any)._keyDown).toBeFunction();
		expect((subject as any)._keyUp).toBeFunction();
		expect((subject as any)._mouseDown).toBeFunction();
		expect((subject as any)._mouseMove).toBeFunction();
		expect((subject as any)._mouseUp).toBeFunction();
	});

	describe("keyboard input", () => {
		beforeEach(() => subject.addListeners());
		afterEach(() => subject.removeListeners());

		it("toggles locator when the l-key is pressed", () => {
			fakeKeyEvent(KeyEvent.DOM_VK_L, true);
			expect(subject.readInput(0) & InputMask.Locator).toBeTruthy();

			fakeKeyEvent(KeyEvent.DOM_VK_L, true);
			expect(subject.readInput(0) & InputMask.Locator).toBeFalsy();

			fakeKeyEvent(KeyEvent.DOM_VK_L, true);
			expect(subject.readInput(0) & InputMask.Locator).toBeTruthy();
		});

		it("toggles pause when the p-key is pressed", () => {
			fakeKeyEvent(KeyEvent.DOM_VK_P, true);
			expect(subject.readInput(0) & InputMask.Pause).toBeTruthy();

			fakeKeyEvent(KeyEvent.DOM_VK_P, true);
			expect(subject.readInput(0) & InputMask.Pause).toBeFalsy();

			fakeKeyEvent(KeyEvent.DOM_VK_P, true);
			expect(subject.readInput(0) & InputMask.Pause).toBeTruthy();
		});

		it("activates dragging while shift key is pressed", () => {
			fakeKeyEvent(KeyEvent.DOM_VK_SHIFT, true);
			expect(subject.readInput(0) & InputMask.Drag).toBeTruthy();
			fakeKeyEvent(KeyEvent.DOM_VK_SHIFT, true);
			expect(subject.readInput(0) & InputMask.Drag).toBeTruthy();

			fakeKeyEvent(KeyEvent.DOM_VK_SHIFT, false);
			expect(subject.readInput(0) & InputMask.Drag).toBeFalsy();
		});

		it("keeps track of directional input", () => {
			const upKey = KeyEvent.DOM_VK_UP;
			const downKey = KeyEvent.DOM_VK_DOWN;
			const leftKey = KeyEvent.DOM_VK_LEFT;
			const rightKey = KeyEvent.DOM_VK_RIGHT;

			fakeKeyEvent(upKey, true);
			expect(subject.readInput(0) & InputMask.Up).toBeTruthy();
			fakeKeyEvent(downKey, true);
			expect(subject.readInput(0) & InputMask.Down).toBeTruthy();
			fakeKeyEvent(leftKey, true);
			expect(subject.readInput(0) & InputMask.Left).toBeTruthy();
			fakeKeyEvent(rightKey, true);
			expect(subject.readInput(0) & InputMask.Right).toBeTruthy();
			expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();

			fakeKeyEvent(upKey, false);
			expect(subject.readInput(0) & InputMask.Up).toBeFalsy();
			fakeKeyEvent(downKey, false);
			expect(subject.readInput(0) & InputMask.Down).toBeFalsy();
			fakeKeyEvent(leftKey, false);
			expect(subject.readInput(0) & InputMask.Left).toBeFalsy();
			fakeKeyEvent(rightKey, false);
			expect(subject.readInput(0) & InputMask.Right).toBeFalsy();
			expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
		});

		it("tracks the 'attack' key", () => {
			const attackKey = KeyEvent.DOM_VK_SPACE;
			fakeKeyEvent(attackKey, true);
			expect(subject.readInput(0) & InputMask.Attack).toBeTruthy();
			fakeKeyEvent(attackKey, false);
			expect(subject.readInput(0) & InputMask.Attack).toBeFalsy();
		});

		it("tracks the 'end dialog' key", () => {
			const endDialogKey = KeyEvent.DOM_VK_SPACE;
			fakeKeyEvent(endDialogKey, true);
			expect(subject.readInput(0) & InputMask.EndDialog).toBeTruthy();
		});

		it("maps up-key presses to scrollUp", () => {
			const scrollUpKey = KeyEvent.DOM_VK_UP;
			fakeKeyEvent(scrollUpKey, true);
			expect(subject.readInput(0) & InputMask.ScrollUp).toBeTruthy();
		});

		it("maps down-key presses to scrollDown", () => {
			const scrollDownKey = KeyEvent.DOM_VK_DOWN;
			fakeKeyEvent(scrollDownKey, true);
			expect(subject.readInput(0) & InputMask.ScrollDown).toBeTruthy();
		});

		it("tracks the 'pick up' key", () => {
			const pickUpKey = KeyEvent.DOM_VK_SPACE;
			fakeKeyEvent(pickUpKey, true);
			expect(subject.readInput(0) & InputMask.PickUp).toBeTruthy();
		});

		it("ignores unknown keys", () => {
			expect(() => {
				fakeKeyEvent(12, true);
				fakeKeyEvent(12, false);
			}).not.toThrow();
		});

		it("does not react to keyboard events after being deactivated", () => {
			let event: any = new CustomEvent("keydown");
			event.which = KeyEvent.DOM_VK_SPACE;
			document.dispatchEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).toBeTruthy();

			event = new CustomEvent("keyup");
			event.which = KeyEvent.DOM_VK_SPACE;
			document.dispatchEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).toBeFalsy();

			subject.removeListeners();
			event = new CustomEvent("keydown");
			event.which = KeyEvent.DOM_VK_SPACE;
			document.dispatchEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();
		});

		it("ignores repeated keyboard events", () => {
			(subject as any)._currentInput = InputMask.None;
			const event: any = { type: true ? "keydown" : "keyup" };
			event.which = KeyEvent.DOM_VK_SPACE;
			event.repeat = true;

			subject.handleEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();
		});

		it("ignores keyboard events that are sent to an input element", () => {
			(subject as any)._currentInput = InputMask.None;
			let event: any = { type: true ? "keydown" : "keyup" };
			event.which = KeyEvent.DOM_VK_SPACE;
			event.target = document.createElement("input");

			subject.handleEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();

			(subject as any)._currentInput = InputMask.None;
			event = { type: true ? "keydown" : "keyup" };
			event.which = KeyEvent.DOM_VK_SPACE;
			event.target = document.createElement("textarea");

			subject.handleEvent(event);
			expect(subject.readInput(0) & InputMask.Attack).not.toBeTruthy();
		});
	});

	describe("contextmenu event", () => {
		beforeEach(() => subject.addListeners());
		afterEach(() => subject.removeListeners());

		it("overrides the browsers context menu", () => {
			const event: any = { type: "contextmenu", preventDefault() {}, stopPropagation() {} };
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
			beforeEach(() => fakeMouse("down", { x: 15, y: 15, button: 0 }));

			it("starts walking", () => {
				expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();
			});

			describe("and the right button is released", () => {
				beforeEach(() => fakeMouse("up", { x: 10, y: 10, button: 1 }));

				it("does not stop walking", () => {
					expect(subject.readInput(0) & InputMask.Walk).toBeTruthy();
				});
			});

			describe("and it is released", () => {
				beforeEach(() => fakeMouse("up", { x: 10, y: 10, button: 0 }));

				it("stops walking", () => {
					expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
				});
			});
		});

		describe("when the left mouse is pressed outside the element", () => {
			beforeEach(() => {
				(subject as any)._currentInput = InputMask.None;
				fakeMouse("down", { x: 0, y: 0, button: 0 }, {});
			});

			it("start does not initiate walking", () => {
				expect(subject.readInput(0) & InputMask.Walk).toBeFalsy();
			});
		});

		describe("when the right mouse is pressed inside the element", () => {
			beforeEach(() => fakeMouse("down", { x: 15, y: 15, button: 1 }));

			it("starts attacking", () => {
				expect(subject.readInput(0) & InputMask.Attack).toBeTruthy();
			});

			describe("and it is released", () => {
				beforeEach(() => fakeMouse("up", { x: 0, y: 0, button: 1 }));

				it("stops attacking", () => {
					expect(subject.readInput(0) & InputMask.Attack).toBeFalsy();
				});
			});
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

	function fakeKeyEvent(code: number, pressed: boolean) {
		const event: any = new CustomEvent(pressed ? "keydown" : "keyup");
		event.which = code;
		event.repeat = false;
		subject.handleEvent(event);
	}

	function fakeMouse(type: string, options: any, target: any = mockElement) {
		const event: any = { type: "mouse" + type };
		event.clientX = options.x;
		event.clientY = options.y;
		event.button = options.button;
		event.target = target;
		subject.handleEvent(event);
	}
});
