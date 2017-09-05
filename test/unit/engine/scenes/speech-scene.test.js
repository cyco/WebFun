import SpeechScene from "src/engine/scenes/speech-scene";

describe("SpeechScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new SpeechScene()).not.toThrow();
	});
});
