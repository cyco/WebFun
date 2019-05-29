import Mixer from "src/engine/audio/mixer";

describe("WebFun.Engine.Audio.Mixer", () => {
	let subject, providerMock, effectsChannel, musicChannel;
	beforeEach(() => {
		providerMock = () => void 0;
		effectsChannel = {};
		musicChannel = {};

		subject = new Mixer(providerMock, musicChannel, effectsChannel);
	});

	it("manages the game's two audio channels", () => {
		expect(subject.muted).toBeFalse();
		expect(subject.volume).toBe(1);

		expect(effectsChannel.provider).toBe(providerMock);
		expect(musicChannel.provider).toBe(providerMock);
	});

	it("can be used to mute / unmute all channels", () => {
		subject.mute();
		expect(effectsChannel.muted).toBeTrue();
		expect(musicChannel.muted).toBeTrue();
		expect(subject.muted).toBeTrue();
		expect(subject.isMuted).toBeTrue();

		subject.unmute();
		expect(effectsChannel.muted).toBeFalse();
		expect(musicChannel.muted).toBeFalse();
		expect(subject.muted).toBeFalse();
		expect(subject.isMuted).toBeFalse();
	});

	it("controls the volume of the channels", () => {
		subject.volume = 0.5;

		expect(subject.volume).toEqual(0.5);
		expect(effectsChannel.volume).toEqual(0.5);
		expect(musicChannel.volume).toEqual(0.5);
	});
});
