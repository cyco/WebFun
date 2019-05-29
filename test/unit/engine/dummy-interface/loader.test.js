import Loader from "src/engine/dummy-interface/loader";

describe("WebFun.Engine.DummyInterface.Loader", () => {
	let subject;

	beforeEach(() => {
		subject = new Loader();
	});

	it("does not do anything", () => {
		expect(() => {
			subject.load();
		}).not.toThrow();
	});
});
