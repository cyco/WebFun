import { Engine } from "src/engine";
import KeyboardInputManager from "src/app/webfun/input/keyboard-input-manager";

describe("WebFun.App.Input.KeyboardInputManager", () => {
	let subject: KeyboardInputManager;
	let mockedEngine: Engine;
	let mockWindow: any;

	describe("when created", () => {
		beforeEach(() => {
			mockWindow = { center: (): void => void 0, manager: { showWindow: jasmine.createSpy() } };
			mockedEngine = {
				metronome: { start: jasmine.createSpy(), stop: jasmine.createSpy() },
				variant: { mapKey: "KeyM" },
				showDebugStatusInfo: jasmine.createSpy()
			} as any;
			spyOn(document, "createElement").and.returnValue(mockWindow);

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

				it("shows the current status info window", () => {
					expect(mockedEngine.showDebugStatusInfo).toHaveBeenCalled();
				});
			});
		});
	});
});
