import PickupScene from "src/engine/scenes/pickup-scene";
import Camera from "src/engine/camera";
import { Engine } from "src/engine";
import { Renderer } from "src/engine/rendering";
import { Tile } from "src/engine/objects";
import { Point } from "src/util";
import { InputMask } from "src/engine/input";

describe("WebFun.Engine.Scenes.PickupScene", () => {
	let subject: PickupScene;
	let item: Tile;
	beforeEach(() => {
		item = { imageData: new Uint8Array() } as any;
		subject = new PickupScene();
		subject.tile = item;
	});

	describe("when shown", () => {
		let engine: Engine;
		beforeEach(() => {
			engine = mockEngine();
			subject.engine = engine;
			subject.willShow();
			subject.didShow();
			subject.update(0);
		});

		describe("and the item is picked up", () => {
			beforeEach(() => {
				(engine.inputManager.readInput as jasmine.Spy).and.returnValue(InputMask.PickUp);
				subject.update(0);

				subject.willHide();
				subject.didHide();
			});

			it("removes the scene", () => {
				expect(engine.sceneManager.popScene).toHaveBeenCalled();
			});

			it("adds the item to the inventory", () => {
				expect(engine.inventory.addItem).toHaveBeenCalledWith(item);
			});

			it("clears the input manager so space does not trigger an attack", () => {
				expect(engine.inputManager.clear).toHaveBeenCalled();
			});
		});
	});

	it("counts ticks and flashes the item", () => {
		const engine: Engine = ({
			camera: { offset: {} },
			inputManager: {
				readInput() {
					return InputMask.None;
				}
			}
		} as any) as Engine;
		const renderer = ({
			renderImage() {}
		} as any) as Renderer;
		const item = ({} as any) as Tile;

		const scene = new PickupScene();
		scene.engine = engine;
		scene.tile = item;
		scene.location = new Point(0, 0);

		spyOn(renderer, "renderImage");

		// doesn't render for five ticks
		for (let i = 0; i < 5; i++) {
			scene.render(renderer);
			scene.update(0);

			expect(renderer.renderImage).not.toHaveBeenCalled();
		}

		// renders the tile for the next five ticks
		for (let i = 0; i < 5; i++) {
			scene.render(renderer);
			scene.update(0);

			expect(renderer.renderImage).toHaveBeenCalledTimes(i + 1);
		}
	});

	it("renders the tile at the correct location", () => {
		const engine = ({
			camera: { offset: { x: -2, y: -1 } },
			inputManager: {
				readInput() {
					return InputMask.None;
				}
			}
		} as any) as Engine;
		const renderer = ({
			renderImage() {}
		} as any) as Renderer;
		const item = ({} as any) as Tile;

		const scene = new PickupScene();
		scene.engine = engine;
		scene.tile = item;
		scene.location = new Point(4, 8);

		(5).times(() => scene.update(0));

		spyOn(renderer, "renderImage");
		scene.render(renderer);

		expect(renderer.renderImage).toHaveBeenCalledWith(undefined, 64, 224);
	});

	function mockEngine(): Engine {
		return {
			camera: new Camera(),
			inputManager: {
				readInput: jasmine.createSpy(),
				clear: jasmine.createSpy()
			},
			sceneManager: { popScene: jasmine.createSpy() },
			inventory: {
				addItem: jasmine.createSpy()
			},
			palette: { current: new Uint8Array() }
		} as any;
	}
});
