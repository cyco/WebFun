import DOMAudioChannel from "src/app/audio/dom-audio-channel";

describe("WebFun.App.Audio.DOMAudioChannel", () => {
	let subject: DOMAudioChannel;

	beforeEach(() => {
		subject = new DOMAudioChannel();
		subject.provider = (input: any) => input;
		subject.muted = false;
		subject.volume = 0.5;
	});

	describe("when some sounds are playing", () => {
		let sound1: HTMLAudioElement;
		let sound2: HTMLAudioElement;

		beforeEach(() => {
			sound1 = mockSound();
			sound2 = mockSound();

			subject.playSound(sound1);
			subject.playSound(sound2);
		});

		it("sets the initial volume correctly", () => {
			expect(sound1.volume).toEqual(0.5);
			expect(sound2.volume).toEqual(0.5);
		});

		it("starts playing the sound", () => {
			expect(sound1.play).toHaveBeenCalled();
		});

		describe("and the channel is stopped", () => {
			beforeEach(() => {
				subject.stop();
			});

			it("stops all sounds", () => {
				expect(sound1.pause).toHaveBeenCalled();
				expect(sound2.pause).toHaveBeenCalled();
			});
		});

		describe("and the volume is changed", () => {
			beforeEach(() => {
				subject.volume = 5;
			});

			it("sets the volume for each sound element that is currently playing", () => {
				expect(sound1.volume).toEqual(5);
				expect(sound2.volume).toEqual(5);
				expect(subject.volume).toEqual(5);
			});
		});

		describe("and the channel is muted", () => {
			beforeEach(() => {
				subject.mute();
			});

			it("mutes all sounds", () => {
				expect(subject.isMuted()).toBeTrue();
				expect(sound1.muted).toBeTrue();
				expect(sound2.muted).toBeTrue();
			});
		});

		describe("and a sound finishes playing", () => {
			beforeEach(() => {
				sound1.onended({} as any);
			});

			it("is not affected by volume changes anymore", () => {
				subject.volume = 0.0;
				expect(sound1.volume).toEqual(0.5);
				expect(sound2.volume).toEqual(0.0);
			});
		});
	});

	it("supports muting", () => {
		expect(subject.isMuted()).toBeFalse();
		subject.mute();
		expect(subject.isMuted()).toBeTrue();
		subject.unmute();
		expect(subject.isMuted()).toBeFalse();
		expect(subject.muted).toBeFalse();
	});

	function mockSound(): HTMLAudioElement {
		return {
			play: jasmine.createSpy(),
			pause: jasmine.createSpy(),
			cloneNode() {
				return this;
			}
		} as any;
	}
});
