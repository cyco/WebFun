import PathUIScene from "src/app/webfun/input/path-ui-scene";
import { Scene } from "src/engine";
import { Point } from "src/util";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/webfun/rendering";

describe("WebFun.App.Input.PathUIScene", () => {
	let subject: PathUIScene;
	let renderer: CanvasRenderer.Renderer;
	beforeEach(() => {
		subject = new PathUIScene();
	});

	it("is a scene that draws the UI for click-to-move input mode", () => {
		expect(subject).toBeInstanceOf(Scene);
	});

	describe("when a highlight point is set", () => {
		beforeEach(() => {
			subject.highlight = new Point(0.4, 1);
		});

		describe("and all conditions for rendering are met", () => {
			beforeEach(() => satisfyRenderingConditions());

			describe("and the highlighted tile is walkable", () => {
				let zoneScene: ZoneScene;
				beforeEach(() => {
					zoneScene = subject.engine.sceneManager.currentScene as ZoneScene;
					(zoneScene.zone.placeWalkable as any).and.returnValue(true);
				});

				it("draws a green rectangle around the target", () => {
					subject.render(renderer);

					expect(zoneScene.zone.placeWalkable).toHaveBeenCalledWith(new Point(5, 9, 0));
					expect(renderer.context.strokeStyle).toBe("rgba(0,255,0,0.5)");
					expect(renderer.context.strokeRect).toHaveBeenCalledWith(96, 288, 32, 32);
				});
			});

			describe("and the highlighted tile is not walkable", () => {
				let zoneScene: ZoneScene;
				beforeEach(() => {
					zoneScene = subject.engine.sceneManager.currentScene as ZoneScene;
					(zoneScene.zone.placeWalkable as any).and.returnValue(false);
				});

				it("draws a red rectangle around the target", () => {
					subject.render(renderer);

					expect(zoneScene.zone.placeWalkable).toHaveBeenCalledWith(new Point(5, 9, 0));
					expect(renderer.context.strokeStyle).toBe("rgba(255,0,0,0.5)");
					expect(renderer.context.strokeRect).toHaveBeenCalledWith(96, 288, 32, 32);
				});
			});
		});
	});

	describe("when a walk target is set", () => {
		beforeEach(() => {
			subject.target = new Point(3, 4);
		});

		describe("and all conditions for rendering are met", () => {
			beforeEach(() => satisfyRenderingConditions());

			it("draws a dashed rectangle around the target", () => {
				subject.render(renderer);

				expect(renderer.context.lineDashOffset).toEqual(0);
				expect(renderer.context.strokeRect).toHaveBeenCalledWith(32, 128, 32, 32);
			});

			it("draws nothing if an unsupported renderer is passed", () => {
				subject.render({} as any);

				expect(renderer.context.strokeRect).not.toHaveBeenCalled();
			});

			describe("and the gameloop advances", () => {
				beforeEach(() => {
					subject.update(1);
				});

				it("draws a differently dashed line", () => {
					subject.render(renderer);
					expect(renderer.context.lineDashOffset).toEqual(-1);
				});
			});
		});
	});

	function satisfyRenderingConditions() {
		renderer = new CanvasRenderer.Renderer(document.createElement("canvas"));
		spyOnProperty(renderer, "context").and.returnValue({
			save: jasmine.createSpy(),
			setLineDash: jasmine.createSpy(),
			strokeRect: jasmine.createSpy(),
			restore: jasmine.createSpy()
		});

		const zoneScene = new ZoneScene();
		spyOnProperty(zoneScene, "zone").and.returnValue({ placeWalkable: jasmine.createSpy() });

		subject.engine = {
			hero: { visible: true },
			sceneManager: { currentScene: zoneScene },
			camera: { offset: new Point(-2, 0) }
		} as any;
	}

	describe("conditions for rendering", () => {
		it("does not render unless a highlight or target point is set", () => {
			expect(subject.canRender(null)).toBeFalse();
		});

		describe("if a highlight or target point is set", () => {
			beforeEach(() => {
				subject.target = new Point(5, 3);
			});

			it("does not render unless the engine property is set up", () => {
				expect(subject.canRender(null)).toBeFalse();
			});

			describe("if the engine is set", () => {
				beforeEach(() => {
					subject.engine = { hero: { visible: false } } as any;
				});

				it("does not render unless the engine has a scene manager", () => {
					expect(subject.canRender(null)).toBeFalse();
				});

				describe("if the scene manager is set", () => {
					beforeEach(() => {
						(subject.engine as any).sceneManager = {} as any;
					});

					it("does not render unless the current scene is a zone scene", () => {
						expect(subject.canRender(null)).toBeFalse();
					});

					describe("if the current scene is a zone scene", () => {
						beforeEach(() => {
							(subject.engine as any).sceneManager.currentScene = new ZoneScene();
						});

						it("does not render unless the a canvas renderer is passed in", () => {
							expect(subject.canRender(null)).toBeFalse();
						});

						describe("if the current scene is a zone scene", () => {
							let renderer: CanvasRenderer.Renderer;
							beforeEach(() => {
								renderer = new CanvasRenderer.Renderer(document.createElement("canvas"));
							});

							it("does not render unless the hero is visible", () => {
								expect(subject.canRender(renderer)).toBeFalse();
							});

							describe("when the hero is visible", () => {
								beforeEach(() => {
									subject.engine.hero.visible = true;
								});

								it("can render", () => {
									expect(subject.canRender(renderer)).toBeTrue();
								});
							});
						});
					});
				});
			});
		});
	});
});
