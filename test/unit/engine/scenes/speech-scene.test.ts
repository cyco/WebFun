import SpeechScene from "src/engine/scenes/speech-scene";
import { Point } from "src/util";
import { Engine } from "src/engine";

describe("WebFun.Engine.Scenes.SpeechScene", () => {
	let subject: SpeechScene;
	let engine: Engine;
	let endSpeechBubble: any;

	beforeEach(() => {
		engine = mockEngine();
		(engine.showText as jasmine.Spy).and.returnValue(new Promise(r => (endSpeechBubble = r)));
		subject = new SpeechScene(engine);
	});

	afterEach(() => {
		if (endSpeechBubble) endSpeechBubble();
		endSpeechBubble = null;
	});

	it("is not opaque", () => {
		expect(subject.isOpaque()).toBeFalse();
	});

	describe("when it is visible", () => {
		beforeEach(() => {
			subject.location = new Point(0, 0);
			subject.text = "Item 1: ¢ Item 2: ¥";
			subject.willShow();
			subject.didShow();
		});

		it("defers displaying the text to the engine", () => {
			expect(engine.showText).toHaveBeenCalled();
		});

		it("sets up the bubble element's text property and resolves variables", () => {
			expect(engine.showText).toHaveBeenCalledWith(
				"Item 1: find Item 2: required",
				jasmine.any(Point)
			);
		});

		it("does not actually render anything in the game view", () => {
			expect(() => subject.render()).not.toThrow();
		});

		it("clears the current mouse handler", () => {
			expect(subject.engine.inputManager.mouseDownHandler).toBeNull();
		});

		afterEach(() => {
			subject.willHide();
			subject.didHide();
			endSpeechBubble();
		});
	});

	function mockEngine(): any {
		return {
			currentSector: {
				findItem: {
					name: "find"
				},
				requiredItem: {
					name: "required"
				}
			},
			showText: jasmine.createSpy(),
			inputManager: { readInput: jasmine.createSpy(), clear() {} },
			sceneManager: {
				popScene: jasmine.createSpy()
			},
			camera: { offset: new Point(0, 0) }
		};
	}
});
