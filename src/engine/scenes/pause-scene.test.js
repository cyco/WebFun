import PauseScene from "/engine/scenes/pause-scene";

describe("PauseScene", () => {
	it('can be instantiated without throwing exceptions', () => {
		expect(() => new PauseScene()).not.toThrow();
	});

	it('watches the input manager for pause button input and eventually pops itself from the scene manager', () => {
		let popCalled = false;
		const engine = {
			inputManager: {pause: true},
			sceneManager: {popScene: () => popCalled = true}
		};

		const scene = new PauseScene();
		scene.engine = engine;
		scene.update();

		expect(popCalled).toBeFalse();

		engine.inputManager.pause = false;

		scene.update();
		expect(popCalled).toBeTrue();
	});

	it('renders a checkered tile above the current scene', () => {
		const renderer = {
			renderImage() {
			}
		};
		spyOn(renderer, 'renderImage');

		const scene = new PauseScene();
		scene.render(renderer);

		expect(scene.isOpaque()).toBeFalse();
		expect(renderer.renderImage).toHaveBeenCalledTimes(9 * 9);
	});
});
