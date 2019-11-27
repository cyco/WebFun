import PickupScene from "src/engine/scenes/pickup-scene";
import Camera from "src/engine/camera";
import { Engine } from "src/engine";
import { Renderer } from "src/engine/rendering";
import { Tile } from "src/engine/objects";
import { Point } from "src/util";
import { InputMask } from "src/engine/input";

describe("WebFun.Engine.Scenes.PickupScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new PickupScene()).not.toThrow();
	});

	it("watches the input manager for pause button input and eventually pops itself from the scene manager", () => {
		let popCalled = false;
		let input = InputMask.None;
		const engine: Engine = ({
			camera: new Camera(),
			inputManager: {
				readInput() {
					return input;
				}
			},
			sceneManager: { popScene: () => (popCalled = true) },
			inventory: {
				addItem: () => {}
			}
		} as any) as Engine;

		const scene = new PickupScene();
		scene.engine = engine;
		scene.update(0);

		expect(popCalled).toBeFalse();

		input = InputMask.PickUp;

		scene.update(0);
		expect(popCalled).toBeTrue();
	});

	it("adds the current item to the inventory when it is removed from the scene manager", () => {
		const item: Tile = ({} as any) as Tile;
		const engine: Engine = ({
			camera: new Camera(),
			inventory: {
				addItem() {}
			}
		} as any) as Engine;
		spyOn(engine.inventory, "addItem");

		const scene = new PickupScene();
		scene.tile = item;
		scene.engine = engine;
		scene.willHide();

		expect(engine.inventory.addItem).toHaveBeenCalledWith(item);
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
});
