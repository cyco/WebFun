import MapScene from "src/engine/scenes/map-scene";
import { Engine } from "src/engine";
import { CheatCodeInput } from "src/engine/cheats";
import * as SpeechScene from "src/engine/scenes/speech-scene";
import { Point, Size } from "src/util";

describe("WebFun.Engine.Scenes.MapScene", () => {
	let subject: MapScene;
	let engine: Engine;
	beforeEach(() => {
		subject = new MapScene();
		subject.engine = mockEngine();
	});

	it("is is opaque", () => {
		expect(subject.isOpaque()).toBeTrue();
	});

	describe("When the scene is shown", () => {
		beforeEach(() => {
			subject.willShow();
			subject.didShow();
		});

		describe("and the locator key is pressed", () => {
			beforeEach(() => {
				(engine.inputManager as any).locator = true;
				subject.update();
			});

			it("removes itself from the scene stack", () => {
				expect(engine.sceneManager.popScene).toHaveBeenCalled();
			});

			describe("after being hidden", () => {
				beforeEach(() => {
					subject.willHide();
				});

				it("disables the keyboard and mouse handlers", () => {
					expect(() => engine.inputManager.mouseDownHandler({} as any)).not.toThrow();
					expect(() => engine.inputManager.keyDownHandler({} as any)).not.toThrow();
				});
			});
		});

		describe("cheat code input", () => {
			let cheatInput: CheatCodeInput;
			beforeEach(() => {
				cheatInput = (subject as any)._cheatInput;
			});

			describe("when a key is pressed", () => {
				beforeEach(() => {
					spyOn(cheatInput, "addCharacter");
					engine.inputManager.keyDownHandler(({ keyCode: 67 } as any) as KeyboardEvent);
				});

				it("its corresponding character is added to a cheat input handler", () => {
					expect(cheatInput.addCharacter).toHaveBeenCalledWith("c");
				});
			});

			describe("when a cheat is complete", () => {
				let mockedSpeechScene: SpeechScene.default;
				beforeEach(() => {
					mockedSpeechScene = {} as SpeechScene.default;
					spyOn(SpeechScene, "default").and.returnValue(mockedSpeechScene);
					spyOn(engine.currentWorld, "findLocationOfZone").and.returnValue(new Point(1, 3));

					spyOn(cheatInput, "execute").and.returnValue(["Cheat Successful!"]);
					spyOn(cheatInput, "reset");

					subject.update();
				});

				it("the input handler is reset", () => {
					expect(cheatInput.reset).toHaveBeenCalled();
				});

				it("shows the cheat's text at the current world location", () => {
					expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(mockedSpeechScene);
					expect(mockedSpeechScene.text).toBe("Cheat Successful!");
					expect(mockedSpeechScene.tileSize).toEqual(new Size(28, 28));
					expect(mockedSpeechScene.location).toEqual(new Point(-3, -1));
					expect(mockedSpeechScene.offset).toEqual(
						new Point(0.013888888888888888, -47.986111111111114)
					);
				});
			});
		});

		describe("and the user clicks somewhere outside of the map", () => {
			beforeEach(() => clickZone(0, 15));

			it("the click is ignored", () => {
				expect(engine.sceneManager.popScene).not.toHaveBeenCalled();
			});
		});

		describe("and the user clicks on an empty field", () => {
			beforeEach(() => {
				spyOn(engine.currentWorld, "at").and.returnValue({ zone: {} } as any);
				clickZone(0, 0);
			});

			it("pops iteself from the scene stack", () => {
				expect(engine.sceneManager.popScene).toHaveBeenCalled();
			});
		});

		describe("and an unvisited zone is clicked", () => {
			beforeEach(() => {
				spyOn(engine.currentWorld, "at").and.returnValue({ zone: { visited: false } } as any);
				clickZone(0, 0);
			});

			it("pops iteself from the scene stack", () => {
				expect(engine.sceneManager.popScene).toHaveBeenCalled();
			});
		});

		afterEach(() => {
			subject.willHide();
			subject.didHide();
		});
	});

	function clickZone(x: number, y: number): void {
		const offset = 0.013888888888888888;
		const tileSizeInViewCoordinates = 0.1;
		engine.inputManager.mouseDownHandler(
			new Point(offset + x * tileSizeInViewCoordinates, offset + y * tileSizeInViewCoordinates)
		);
	}

	function mockEngine(): Engine {
		return (engine = ({
			camera: { offset: new Point(4, 4) },
			assetManager: {
				get: (): void => void 0
			},
			sceneManager: {
				pushScene: jasmine.createSpy("pushScene"),
				popScene: jasmine.createSpy("popScene")
			},
			inputManager: {
				clear: (): void => void 0,
				keyDownHandler: (): void => void 0
			},
			currentZone: {},
			currentWorld: {
				findLocationOfZone: (): void => void 0,
				at: (): void => void 0
			}
		} as any) as Engine);
	}
});
