import DOMSoundLoader from "src/app/audio/dom-sound-loader";
import { EventTarget } from "src/util";

describe("WebFun.App.Audio.DOMSoundLoader", () => {
	let subject: DOMSoundLoader;

	beforeEach(() => {
		subject = new DOMSoundLoader("mocked-base-url");
	});

	describe("when a sound is requested", () => {
		let soundPromise: Promise<any>;
		let mockedAudio: any;

		beforeEach(() => {
			mockedAudio = new (class extends EventTarget {
				load = jasmine.createSpy();
			})();
			spyOn(window as any, "Audio").and.returnValue(mockedAudio);
			soundPromise = subject.loadSound("my-sound");
		});

		it("creates an audio element using the base url and the requested file name", () => {
			expect((window as any).Audio).toHaveBeenCalledWith("mocked-base-url/my-sound.mp3");
		});

		it("a promise is returned", () => {
			expect(soundPromise).toBeInstanceOf(Promise);
		});

		it("starts loading the audio's source", () => {
			expect(mockedAudio.load).toHaveBeenCalled();
		});

		it("resolves the promise once the audio object sends the appropriate event", async () => {
			mockedAudio.dispatchEvent(new CustomEvent("loadeddata"));
			expect(await soundPromise).toBe(mockedAudio);
		});

		it("rejects the promise if an error occurs", async () => {
			mockedAudio.dispatchEvent(new CustomEvent("error"));
			try {
				await soundPromise;
				fail("Promise should have been rejected");
			} catch (e) {
				expect(true).toBeTrue();
			}
		});

		it("rejects the promise event if a serious error occurs", async () => {
			mockedAudio.load = jasmine.createSpy().and.throwError("Invalid URL");
			try {
				await subject.loadSound("my-sound");
				fail("Promise should have been rejected");
			} catch (e) {}
		});
		it("resolved the promise immediately if the audio element is cached", async () => {
			mockedAudio.readyState = 4;
			expect(await subject.loadSound("my-sound")).toBe(mockedAudio);
		});
	});
});
