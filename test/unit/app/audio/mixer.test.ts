import * as WebAudio from "src/std/webaudio";
import { Mixer } from "src/app/audio";
import { Sound } from "src/engine/objects";
import { Channel } from "src/engine/audio";
import Settings from "src/settings";

describe("WebFun.App.Audio.Mixer", () => {
	let subject: Mixer;
	let contextMock: AudioContext;
	let bufferSourceMock: AudioBufferSourceNode;
	let settings: typeof Settings;
	let master: GainNode, effect: GainNode, music: GainNode;

	beforeEach(() => {
		master = { connect: jasmine.createSpy("master"), gain: { value: 1 } } as any;
		effect = { connect: jasmine.createSpy("effect") } as any;
		music = { connect: jasmine.createSpy("music") } as any;
		settings = { playMusic: true, playEffects: true } as any;
		bufferSourceMock = { connect: jasmine.createSpy("source"), start: jasmine.createSpy() } as any;
		contextMock = {
			decodeAudioData() {},
			createBufferSource() {},
			createGain() {},
			destination: {}
		} as any;
		spyOn(WebAudio, "AudioContext").and.returnValue(contextMock);
		spyOn(contextMock, "createGain").and.returnValues(master, effect, music);
		subject = new Mixer(settings as any);
	});

	it("creates an audio context on construction", () => {
		expect(WebAudio.AudioContext).toHaveBeenCalled();
		expect(subject.context).toBe(contextMock);
	});

	it("sets up the audio network as expected", () => {
		expect(master.connect).toHaveBeenCalledWith(contextMock.destination);
		expect(effect.connect).toHaveBeenCalledWith(master);
		expect(music.connect).toHaveBeenCalledWith(master);
	});

	it("uses a gain node to adjust the volume", () => {
		expect(subject.volume).toEqual(1);
		subject.volume = 0.5;
		expect(subject.volume).toEqual(0.5);
		expect(master.gain.value).toEqual(0.5);
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

	it("plays sound effects on the right node", () => {
		const sound: Sound = { representation: {} } as any;
		spyOn(contextMock, "createBufferSource").and.returnValue(bufferSourceMock);

		subject.play(sound, Channel.Effect);

		expect(bufferSourceMock.buffer).toBe(sound.representation);
		expect(bufferSourceMock.connect).toHaveBeenCalledWith(effect);
		expect(bufferSourceMock.start).toHaveBeenCalledWith(0);
	});

	it("plays music on the right node", () => {
		const sound: Sound = { representation: {} } as any;
		spyOn(contextMock, "createBufferSource").and.returnValue(bufferSourceMock);

		subject.play(sound, Channel.Music);

		expect(bufferSourceMock.buffer).toBe(sound.representation);
		expect(bufferSourceMock.connect).toHaveBeenCalledWith(music);
		expect(bufferSourceMock.start).toHaveBeenCalledWith(0);
	});

	it("does not play sounds if the channel is disabled", () => {
		const sound: Sound = { representation: {} } as any;
		spyOn(contextMock, "createBufferSource");
		settings.playEffects = false;
		subject.play(sound, Channel.Effect);

		expect(contextMock.createBufferSource).not.toHaveBeenCalled();
	});

	it("does not implement stop yet", () => {
		expect(() => subject.stop()).not.toThrow();
	});
});
