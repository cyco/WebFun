import Engine from "src/engine/engine";

describe("Engine", () => {
	it("it holds all state required for running a game", () => {
		const engine = new Engine();

		expect(engine).toHaveMember("metronome");
		expect(engine).toHaveMember("sceneManager");
		expect(engine).toHaveMember("renderer");
		expect(engine).toHaveMember("data");
	});

	it("passes render and update requests on to the scene manager", () => {
		let renderPassedOn = false;
		let updatePassedOn = false;

		const engine = new Engine();
		engine.sceneManager = {
			update: () => ((updatePassedOn = true), Promise.resolve(void 0)),
			render: () => (renderPassedOn = true)
		};

		engine.update();
		engine.render();
	});
});
