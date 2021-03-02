import WinScene from "src/engine/scenes/win-scene";
import { Engine } from "src/engine";
import { ZoneScene } from "src/engine/scenes";
import * as ZoneSceneModule from "src/engine/scenes/zone-scene";
import { Point } from "src/util";
import { InputMask } from "src/engine/input";
import { Settings } from "src";

describe("WebFun.Engine.Scenes.WinScene", () => {
	let subject: WinScene;
	let engine: Engine;
	let zoneScene: ZoneScene;

	beforeEach(() => {
		subject = new WinScene(512.12);

		Settings.skipWinScene = false;
		Settings.debug = false;
	});

	describe("when it is about to be shown", () => {
		beforeEach(() => {
			zoneScene = mockZoneScene();
			engine = mockEngine();

			spyOn(ZoneSceneModule, "default").and.returnValue(zoneScene);

			subject.engine = engine;
			subject.willShow();
		});

		afterEach(() => {
			subject.willHide();
			subject.didHide();
		});

		it("creates a zone scene", () => {
			expect(ZoneSceneModule.default).toHaveBeenCalled();
		});

		it("hides the hero", () => {
			expect(engine.hero.location).toEqual(new Point(0, 0));
			expect(engine.hero.visible).toBeFalse();
			expect(engine.camera.update).toHaveBeenCalled();
		});

		describe("and it's subsequently shown", () => {
			beforeEach(() => {
				subject.didShow();
			});

			it("sets up the engine to execute the proper scripts", () => {});

			it("tells the zone scene it just became visible", () => {
				expect(zoneScene.didShow).toHaveBeenCalled();
			});

			describe("and the scene is rendered", () => {
				beforeEach(() => {
					subject.render({} as any);
				});

				it("passes the render call on to the wrapped zone scene", () => {
					expect(zoneScene.render).toHaveBeenCalled();
				});
			});

			describe("and the scene is updated", () => {
				beforeEach(() => {
					subject.update(1);
				});

				it("passes `update` on to the underlying zone scene", () => {
					expect(zoneScene.update).toHaveBeenCalled();
				});

				describe("and the attack key is pressed", () => {
					beforeEach(() => {
						(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.Attack);
						subject.update(1);
					});

					it("does not pop the scene until the animation is finished", () => {
						expect(engine.sceneManager.popScene).not.toHaveBeenCalled();
					});
				});

				describe("and the locator key is pressed", () => {
					beforeEach(() => {
						(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.Locator);
						subject.update(1);
					});

					it("does not pop the scene until the animation is finished", () => {
						expect(engine.sceneManager.popScene).not.toHaveBeenCalled();
					});
				});

				describe("and the walk key is pressed", () => {
					beforeEach(() => {
						(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.Walk);
						subject.update(1);
					});

					it("does not pop the scene until the animation is finished", () => {
						expect(engine.sceneManager.popScene).not.toHaveBeenCalled();
					});
				});
			});

			describe("and the game loop advances", () => {
				beforeEach(() => {
					for (let i = 0; i < 15; i++) subject.update(1);
				});

				describe("and the attack key is pressed", () => {
					beforeEach(() => {
						(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.Attack);
						subject.update(1);
					});

					it("removes the scene from the stack", () => {
						expect(engine.sceneManager.popScene).toHaveBeenCalled();
					});
				});

				describe("and the locator key is pressed", () => {
					beforeEach(() => {
						(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.Locator);
						subject.update(1);
					});

					it("removes the scene from the stack", () => {
						expect(engine.sceneManager.popScene).toHaveBeenCalled();
					});
				});

				describe("and the walk key is pressed", () => {
					beforeEach(() => {
						(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.Walk);
						subject.update(1);
					});

					it("removes the scene from the stack", () => {
						expect(engine.sceneManager.popScene).toHaveBeenCalled();
					});
				});
			});

			describe("and it is hidden again", () => {
				beforeEach(() => {
					subject.willHide();
					subject.didHide();
				});

				it("tells the wrapped zone scene about visibility changes", () => {
					expect(zoneScene.willHide).toHaveBeenCalled();
					expect(zoneScene.didHide).toHaveBeenCalled();
				});

				it("restores the hero's position and visibility", () => {
					expect(engine.hero.location).toEqual(new Point(7, 4));
					expect(engine.hero.visible).toBeTrue();
					expect(engine.camera.update).toHaveBeenCalledTimes(2);
				});
			});
		});

		describe("and it's shown with the skip scene setting active", () => {
			let originalValue: boolean;
			beforeEach(() => {
				originalValue = Settings.skipWinScene;
				Settings.skipWinScene = true;
				subject.didShow();
			});

			afterEach(() => {
				Settings.skipWinScene = originalValue;
			});

			it("immediately leaves the scene again", () => {
				expect(engine.sceneManager.popScene).toHaveBeenCalled();
			});
		});
	});

	function mockEngine(): Engine {
		return {
			hero: { location: new Point(7, 4), visible: true },
			assets: { find: jasmine.createSpy() },
			inputManager: { readInput: jasmine.createSpy() },
			sceneManager: { popScene: jasmine.createSpy() },
			camera: { update: jasmine.createSpy() }
		} as any;
	}

	function mockZoneScene(): ZoneScene {
		return {
			willShow: jasmine.createSpy(),
			didShow: jasmine.createSpy(),
			willHide: jasmine.createSpy(),
			didHide: jasmine.createSpy(),
			update: jasmine.createSpy(),
			render: jasmine.createSpy()
		} as any;
	}
});
