import SpeechScene from "src/engine/scenes/speech-scene";

describe("WebFun.Engine.Scenes.SpeechScene", () => {
	it("can be instantiated without throwing exceptions", () => {
		expect(() => new SpeechScene()).not.toThrow();
	});
});
