import PauseScene from "src/engine/scenes/pause-scene";
import { Engine } from "src/engine";
import { Renderer } from "src/engine/rendering";

describe("WebFun.Engine.Scenes.PauseScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new PauseScene()).not.toThrow();
	});

	it("watches the input manager for pause button input and eventually pops itself from the scene manager", () => {
		let popCalled = false;
		const engine: Engine = {
			inputManager: {
				pause: true,
				clear: function() {
					this.pause = false;
				},
				temporaryState: { totalPlayTime: 0, currentPlayStart: new Date() }
			},
			sceneManager: { popScene: () => (popCalled = true) }
		} as any;

		const scene = new PauseScene();
		scene.engine = engine;
		scene.willShow();

		scene.update();
		expect(popCalled).toBeFalse();

		(engine.inputManager as any).pause = true;

		scene.update();
		expect(popCalled).toBeTrue();
	});

	it("renders a checkered tile above the current scene", () => {
		const renderer = ({
			drawImage() {}
		} as any) as Renderer;
		spyOn(renderer, "drawImage");

		const scene = new PauseScene();
		scene.render(renderer);

		expect(scene.isOpaque()).toBeFalse();
		expect(renderer.drawImage).toHaveBeenCalledTimes(9 * 9);
	});
});
