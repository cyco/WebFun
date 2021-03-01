import { Engine } from "src/engine";
import KeyboardInputManager from "src/app/webfun/input/keyboard-input-manager";
import { CurrentStatusInfo } from "src/app/webfun/ui";
import { WindowManager } from "src/ui";

describe("WebFun.App.Input.KeyboardInputManager", () => {
	let subject: KeyboardInputManager;
	let mockedEngine: Engine;
	let mockWindow: any;

	describe("when created", () => {
		beforeEach(() => {
			mockWindow = { center: (): void => void 0 };
			mockedEngine = {
				metronome: { start: jasmine.createSpy(), stop: jasmine.createSpy() }
			} as any;
			spyOn(document, "createElement").and.returnValue(mockWindow);
			spyOn(WindowManager.defaultManager, "showWindow");

			subject = new KeyboardInputManager();
			subject.engine = mockedEngine;
		});

		describe("and the listeners are registered", () => {
			beforeEach(() => {
				subject.addListeners();
			});

			describe("and CTRL+SHIFT+F8 is pressed", () => {
				beforeEach(() => {
					document.dispatchEvent(
						new KeyboardEvent("keydown", { ctrlKey: true, shiftKey: true, code: "F8" })
					);
				});

				it("stops the timer", () => {
					expect(mockedEngine.metronome.stop).toHaveBeenCalled();
				});

				it("shows a window displaying debug information", () => {
					expect(document.createElement).toHaveBeenCalledWith(CurrentStatusInfo.tagName);
					expect(WindowManager.defaultManager.showWindow).toHaveBeenCalledWith(mockWindow);
					expect(mockWindow.engine).toBe(mockedEngine);
				});

				describe("and the window is closed", () => {
					beforeEach(() => {
						mockWindow.onclose();
					});

					it("starts the metronome again", () => {
						expect(mockedEngine.metronome.start).toHaveBeenCalled();
					});
				});
			});
		});
	});
});
