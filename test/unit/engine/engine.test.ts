import { Engine, SceneManager } from "src/engine";
import { Yoda, Indy } from "src/engine/type";

describe("Engine", () => {
	it("it holds all state required for running a game", () => {
		const engine = new Engine(Yoda, {});

		expect(engine).toHaveMember("metronome");
		expect(engine).toHaveMember("sceneManager");
		expect(engine).toHaveMember("renderer");
		expect(engine).toHaveMember("inputManager");
	});

	it("passes render and update requests on to the scene manager", () => {
		let renderPassedOn = false;
		let updatePassedOn = false;

		const engine = new Engine(Indy, {
			SceneManager: () =>
				(({
					update: () => ((updatePassedOn = true), Promise.resolve(void 0)),
					render: () => (renderPassedOn = true)
				} as any) as SceneManager)
		});

		engine.update(1);
		engine.render();

		expect(renderPassedOn).toBeTrue();
		expect(updatePassedOn).toBeTrue();
	});
});
