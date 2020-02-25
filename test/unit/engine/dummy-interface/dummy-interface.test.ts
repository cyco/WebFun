import Interface from "src/engine/dummy-interface";
import SceneManager from "src/engine/scene-manager";
import { InputManager, Renderer, Mixer } from "src/engine/dummy-interface";

describe("WebFun.Engine.DummyInterface", () => {
	it("defines stubs for the engine's interface to the outer world", () => {
		expect(Interface.SceneManager()).toBeInstanceOf(SceneManager);
		expect(Interface.InputManager()).toBeInstanceOf(InputManager);
		expect(Interface.Mixer()).toBeInstanceOf(Mixer);
		expect(Interface.Renderer()).toBeInstanceOf(Renderer);

		const sceneManager = Interface.SceneManager();
		expect(() => (sceneManager as any)._determineBounds()).not.toThrow();
	});
});
