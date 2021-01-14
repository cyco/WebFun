import DetonatorScene from "src/engine/scenes/detonator-scene";
import { Engine } from "src/engine";
import { Point, Rectangle, Size } from "src/util";
import { Renderer } from "src/engine/rendering";
import * as Rendering from "src/app/webfun/rendering";

describe("WebFun.Engine.Scenes.DetonatorScene", () => {
	let subject: DetonatorScene;
	beforeEach(() => {
		spyOn(Rendering, "drawTileImageData").and.returnValues(
			mockTileImage(),
			mockTileImage(),
			mockTileImage(),
			mockTileImage(),
			mockTileImage(),
			mockTileImage()
		);

		subject = new DetonatorScene();
	});

	describe("when the engine property is set", () => {
		beforeEach(() => {
			subject.detonatorLocation = new Point(3, 3);
			subject.engine = mockEngine();
		});

		describe("and the scene is shown", () => {
			beforeEach(() => {
				subject.willShow();
				subject.didShow();
			});

			it("renders the first frame", () => {
				const renderer = mockRenderer();
				subject.render(renderer);
				expect(renderer.renderImage).toHaveBeenCalledWith(
					(subject as any)._detonatorFrames[0],
					96,
					96
				);
			});

			describe("and the game loop advances", () => {
				beforeEach(() => {
					subject.update();
				});

				it("renders the another frame", () => {
					const renderer = mockRenderer();
					subject.render(renderer);
					expect(renderer.renderImage).toHaveBeenCalledWith(
						(subject as any)._detonatorFrames[1],
						96,
						96
					);
				});

				describe("and the game loop advances a lot further", () => {
					beforeEach(() => {
						subject.update();
						subject.update();
						subject.update();
					});

					it("damages all active monsters to a variying degree", () => {
						expect(subject.engine.currentZone.monsters[0].damageTaken).toBe(10);
						expect(subject.engine.currentZone.monsters[1].damageTaken).toBe(8);
						expect(subject.engine.currentZone.monsters[2].damageTaken).toBe(8);
					});

					it("does not damage inactive monsters", () => {
						expect(subject.engine.currentZone.monsters[4].damageTaken).toBe(0);
					});

					it("does not damage enabled monsters that are too far away", () => {
						expect(subject.engine.currentZone.monsters[3].damageTaken).toBe(0);
					});

					it("pops the scene from the stack", () => {
						expect(subject.engine.sceneManager.popScene).toHaveBeenCalled();
					});

					describe("and the game loop advances still further", () => {
						beforeEach(() => {
							subject.update();
							subject.update();
						});

						it("does not render any animation frames anymore", () => {
							const renderer = mockRenderer();
							subject.render(renderer);
							expect(renderer.renderImage).not.toHaveBeenCalled();
						});
					});
				});
			});

			describe("and the scene is hidden", () => {
				beforeEach(() => {
					subject.willHide();
					subject.didHide();
				});

				it("ignores calls to `update", () => {
					for (let i = 0; i < 10; i++) {
						expect(subject.engine.sceneManager.popScene).not.toHaveBeenCalled();
					}
				});
			});

			afterEach(() => {
				subject.willHide();
				subject.didHide();
			});
		});

		describe("and the engine property is cleared", () => {
			beforeEach(() => {
				subject.engine = null;
			});

			it("is removed", () => {
				expect(subject.engine).toBeNull();
			});
		});
	});

	function mockEngine(): Engine {
		return {
			camera: { offset: new Point(0, 0) },
			sceneManager: { popScene: jasmine.createSpy() },
			currentZone: {
				bounds: new Rectangle(new Point(0, 0), new Size(9, 9)),
				monsters: [
					{ damageTaken: 0, position: new Point(3, 3), enabled: true },
					{ damageTaken: 0, position: new Point(2, 3), enabled: true },
					{ damageTaken: 0, position: new Point(3, 4), enabled: true },
					{ damageTaken: 0, position: new Point(0, 3), enabled: true },
					{ damageTaken: 0, position: new Point(3, 2), enabled: false }
				],
				setTile: jasmine.createSpy()
			},
			assets: { get: jasmine.createSpy() },
			palette: { original: {} }
		} as any;
	}

	function mockRenderer(): Renderer {
		return { renderImage: jasmine.createSpy() } as any;
	}

	function mockTileImage(): any {
		return {
			toImage: () => ({
				then: (resolve: any) => resolve({})
			})
		};
	}
});
