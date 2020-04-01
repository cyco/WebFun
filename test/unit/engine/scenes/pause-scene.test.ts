import PauseScene from "src/engine/scenes/pause-scene";
import { Engine } from "src/engine";
import { Renderer } from "src/engine/rendering";
import { InputMask } from "src/engine/input";

describe("WebFun.Engine.Scenes.PauseScene", () => {
	let subject: PauseScene;
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new PauseScene()).not.toThrow();
	});

	it("watches the input manager for pause button input and eventually pops itself from the scene manager", () => {
		let popCalled = false;
		let pause: boolean = true;
		const engine: Engine = {
			inputManager: {
				readInput() {
					return pause ? InputMask.Pause : InputMask.None;
				},
				clear: function () {
					pause = false;
				}
			},
			temporaryState: { totalPlayTime: 0, currentPlayStart: new Date() },
			sceneManager: { popScene: () => (popCalled = true) }
		} as any;

		subject = new PauseScene();
		subject.engine = engine;
		subject.willShow();

		subject.update(0);
		expect(popCalled).toBeFalse();

		pause = true;

		subject.update(0);
		expect(popCalled).toBeTrue();
	});

	it("renders a checkered tile above the current scene", () => {
		const renderer = ({
			drawImage() {}
		} as any) as Renderer;
		spyOn(renderer, "drawImage");

		subject = new PauseScene();
		subject.engine = { temporaryState: {} } as any;
		subject.render(renderer);

		expect(subject.isOpaque()).toBeFalse();
		expect(renderer.drawImage).toHaveBeenCalledTimes(9 * 9);
	});
});
