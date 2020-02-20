import SpeechScene from "src/engine/scenes/speech-scene";
import { Rectangle, Size, Point } from "src/util";
import * as UX from "src/ux";
import { InputMask } from "src/engine/input";

describe("WebFun.Engine.Scenes.SpeechScene", () => {
	let subject: SpeechScene;
	let bubbleElement: any;
	beforeEach(() => {
		bubbleElement = document.createElement("div");
		bubbleElement.show = jasmine.createSpy();
		bubbleElement.end = jasmine.createSpy();
		spyOn(document, "createElement").and.returnValue(bubbleElement as any);

		subject = new SpeechScene(mockEngine());
	});

	it("is not opaque", () => {
		expect(subject.isOpaque()).toBeFalse();
	});

	describe("when it is visible", () => {
		let modalSession: UX.ModalSession;

		beforeEach(() => {
			modalSession = {
				run: jasmine.createSpy(),
				end: jasmine.createSpy()
			} as any;
			spyOn(UX, "ModalSession").and.returnValue(modalSession);

			subject.location = new Point(0, 0);
			subject.text = "Item 1: ¢ Item 2: ¥";
			subject.willShow();
			subject.didShow();
		});

		it("starts a new modal session", () => {
			expect(modalSession.run).toHaveBeenCalled();
		});

		it("sets up the bubble element's text property and resolves variables", () => {
			expect(subject.text).toEqual("Item 1: find Item 2: required");
			expect(bubbleElement.text).toEqual("Item 1: find Item 2: required");
		});

		it("sets up the speech bubble to remove the scene when the close button is used", () => {
			bubbleElement.onend();
			expect(subject.engine.sceneManager.popScene).toHaveBeenCalled();
		});

		it("shows the speech bubble element", () => {
			expect(bubbleElement.show).toHaveBeenCalled();
		});

		it("does not actually render anything in the game view", () => {
			expect(() => subject.render()).not.toThrow();
		});

		it("clears the current mouse handler", () => {
			expect(() => subject.engine.inputManager.mouseDownHandler(null)).not.toThrow();
		});

		it("checks the input manager for an exit command", () => {
			(subject.engine.inputManager.readInput as any).and.returnValue(InputMask.EndDialog);
			subject.update(0);
			expect(bubbleElement.end).toHaveBeenCalled();
		});

		describe("and it is hidden", () => {
			beforeEach(() => {
				subject.willHide();
				subject.didHide();
			});

			it("clears the mouse handler again", () => {
				expect(() => subject.engine.inputManager.mouseDownHandler(null)).not.toThrow();
			});

			it("ends the modal session", () => {
				expect(modalSession.end).toHaveBeenCalled();
			});
		});

		afterEach(() => {
			subject.willHide();
			subject.didHide();
		});
	});

	function mockEngine(): any {
		return {
			inputManager: { readInput: jasmine.createSpy() },
			sceneManager: {
				popScene: jasmine.createSpy(),
				bounds: new Rectangle(new Point(0, 0), new Size(288, 288))
			},
			camera: { offset: new Point(0, 0) },
			currentWorld: {
				findSectorContainingZone: () => ({
					findItem: {
						name: "find"
					},
					requiredItem: {
						name: "required"
					}
				})
			},
			currentZone: {}
		};
	}
});
