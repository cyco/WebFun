import Interface from "src/engine/dummy-interface";
import SceneManager from "src/engine/scene-manager";
import { Mixer } from "src/engine/audio";
import { Channel, InputManager, Loader, Renderer } from "src/engine/dummy-interface";
import DummyChannel from "src/engine/dummy-interface/channel";

describe("WebFun.Engine.DummyInterface", () => {
	it("defines stubs for the engine's interface to the outer world", () => {
		expect(Interface.SceneManager()).toBeInstanceOf(SceneManager);
		expect(Interface.InputManager()).toBeInstanceOf(InputManager);
		expect(Interface.Channel()).toBeInstanceOf(Channel);
		expect(
			Interface.Mixer(() => void 0, ({} as any) as DummyChannel, ({} as any) as DummyChannel)
		).toBeInstanceOf(Mixer);
		expect(Interface.Loader()).toBeInstanceOf(Loader);
		expect(Interface.Renderer()).toBeInstanceOf(Renderer);

		const sceneManager = Interface.SceneManager();
		expect(() => (sceneManager as any)._determineBounds()).not.toThrow();
	});
});
