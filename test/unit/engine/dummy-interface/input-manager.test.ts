import InputManager from "src/engine/dummy-interface/input-manager";

describe("WebFun.Engine.DummyInterface.InputManager", () => {
	let subject: InputManager;

	beforeEach(() => {
		subject = new InputManager();
	});

	it("does not do anything", () => {
		expect(() => {
			subject.clear();
			subject.addListeners();
			subject.removeListeners();
		}).not.toThrow();
	});
});
