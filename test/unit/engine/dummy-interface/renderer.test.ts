import Renderer from "src/engine/dummy-interface/renderer";

describe("WebFun.Engine.DummyInterface.Renderer", () => {
	let subject: Renderer;

	beforeEach(() => {
		subject = new Renderer();
	});

	it("does not do anything", () => {
		expect(() => {
			subject.clear();
			subject.redisplayTile(0, 0);
			subject.redisplayRect(0, 0, 0, 0);
			subject.redisplay();
			subject.fillBlackRect(0, 0, 0, 0);
		}).not.toThrow();
	});
});
