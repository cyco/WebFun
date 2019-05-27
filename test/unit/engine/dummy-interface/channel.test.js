import Channel from "src/engine/dummy-interface/channel";

describe("WebFun..Engine.DummyInterface.Channel", () => {
	let subject;

	beforeEach(() => {
		subject = new Channel();
	});

	it("does not do anything", () => {
		expect(() => {}).not.toThrow();
	});

	it("implements muting", () => {
		expect(subject.muted).toBeFalse();
		subject.mute();
		expect(subject.muted).toBeTrue();
		subject.unmute();
		expect(subject.muted).toBeFalse();
	});
});
