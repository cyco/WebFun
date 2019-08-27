import * as WebAudio from "src/std/webaudio";
import { Mixer } from "src/app/audio";
import { Sound } from "src/engine/objects";
import { Channel } from "src/engine/audio";

describe("WebFun.App.Audio.Mixer", () => {
	let subject: Mixer;
	let contextMock: AudioContext;
	let bufferSourceMock: AudioBufferSourceNode;

	beforeEach(() => {
		bufferSourceMock = { connect: jasmine.createSpy(), start: jasmine.createSpy() } as any;
		contextMock = {
			decodeAudioData() {},
			createBufferSource() {},
			destination: {}
		} as any;
		spyOn(WebAudio, "AudioContext").and.returnValue(contextMock);
		subject = new Mixer();
	});

	it("creates an audio context on construction", () => {
		expect(WebAudio.AudioContext).toHaveBeenCalled();
		expect(subject.context).toBe(contextMock);
	});

	describe("sound preparation", () => {
		let soundMock: Sound;
		let bufferMock: ArrayBuffer;
		let preparedBufferMock: AudioBuffer;

		beforeEach(() => {
			soundMock = {} as any;
			bufferMock = {} as any;
			preparedBufferMock = {} as any;

			spyOn(contextMock, "decodeAudioData").and.callFake((_, success, _failure) => {
				success(preparedBufferMock);
				return Promise.resolve(preparedBufferMock);
			});
		});

		it("decodes the buffer and sets up the sounds representation", async () => {
			await subject.prepare(soundMock, bufferMock);
			expect(soundMock.representation).toBe(preparedBufferMock);
		});
	});

	it("plays sound on the given channel", () => {
		const sound: Sound = { representation: {} } as any;
		spyOn(contextMock, "createBufferSource").and.returnValue(bufferSourceMock);

		subject.play(sound, Channel.Effect);

		expect(bufferSourceMock.buffer).toBe(sound.representation);
		expect(bufferSourceMock.connect).toHaveBeenCalledWith(contextMock.destination);
		expect(bufferSourceMock.start).toHaveBeenCalledWith(0);
	});

	it("does not implement stop yet", () => {
		expect(() => subject.stop()).not.toThrow();
	});
});
