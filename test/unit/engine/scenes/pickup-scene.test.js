import PickupScene from "src/engine/scenes/pickup-scene";

describe("WebFun.Engine.Scenes.PickupScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new PickupScene()).not.toThrow();
	});

	it("watches the input manager for pause button input and eventually pops itself from the scene manager", () => {
		let popCalled = false;
		const engine = {
			inputManager: { pickUp: false },
			sceneManager: { popScene: () => (popCalled = true) },
			inventory: {
				addItem: () => {}
			}
		};

		const scene = new PickupScene();
		scene.engine = engine;
		scene.update();

		expect(popCalled).toBeFalse();

		engine.inputManager.pickUp = true;

		scene.update();
		expect(popCalled).toBeTrue();
	});

	it("adds the current item to the inventory when it is removed from the scene manager", () => {
		const item = {};
		const engine = {
			inventory: {
				addItem() {}
			}
		};
		spyOn(engine.inventory, "addItem");

		const scene = new PickupScene();
		scene.tile = item;
		scene.engine = engine;
		scene.willHide();

		expect(engine.inventory.addItem).toHaveBeenCalledWith(item);
	});

	it("counts ticks and flashes the item", () => {
		const engine = {
			inputManager: {},
			sceneManager: { _stack: [{ camera: { offset: {} } }] }
		};
		const renderer = {
			renderTile() {}
		};
		const item = {};

		const scene = new PickupScene();
		scene.engine = engine;
		scene.tile = item;
		scene.location = {};

		spyOn(renderer, "renderTile");

		// doesn't render for five ticks
		for (let i = 0; i < 5; i++) {
			scene.render(renderer);
			scene.update();

			expect(renderer.renderTile).not.toHaveBeenCalled();
		}

		// renders the tile for the next five ticks
		for (let i = 0; i < 5; i++) {
			scene.render(renderer);
			scene.update();

			expect(renderer.renderTile).toHaveBeenCalledTimes(i + 1);
		}
	});

	it("renders the tile at the correct location", () => {
		const engine = {
			inputManager: {},
			sceneManager: { _stack: [{ camera: { offset: { x: -2, y: -1 } } }] }
		};
		const renderer = {
			renderTile() {}
		};
		const item = {};

		const scene = new PickupScene();
		scene.engine = engine;
		scene.tile = item;
		scene.location = { x: 4, y: 8 };

		(5).times(() => scene.update());

		spyOn(renderer, "renderTile");
		scene.render(renderer);

		expect(renderer.renderTile).toHaveBeenCalledWith(item, 2, 7, 1);
	});
});
