import Channel from "src/engine/dummy-interface/channel";

describe("WebFun.Engine.DummyInterface.Channel", () => {
	let subject: Channel;

	beforeEach(() => {
		subject = new Channel();
	});

	it("does not do anything", () => {
		expect(() => subject.playSound("")).not.toThrow();
		expect(() => subject.stop()).not.toThrow();
	});

	it("implements muting", () => {
		expect(subject.muted).toBeFalse();
		expect(subject.isMuted()).toBeFalse();

		subject.mute();
		expect(subject.muted).toBeTrue();
		expect(subject.isMuted()).toBeTrue();

		subject.unmute();
		expect(subject.muted).toBeFalse();
		expect(subject.isMuted()).toBeFalse();
	});
});
