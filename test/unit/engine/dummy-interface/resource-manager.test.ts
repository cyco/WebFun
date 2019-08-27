import { ResourceManager } from "src/engine/dummy-interface";

describe("WebFun.Engine.DummyInterface.ResourceManager", () => {
	const progressHandler: () => void = () => void 0;
	let subject: ResourceManager;

	beforeEach(() => {
		subject = new ResourceManager();
	});

	it("throws an error when palette is requested", () => {
		expect(() => subject.loadPalette(progressHandler)).toThrow();
	});

	it("throws an error when a game data stream is requested", () => {
		expect(() => subject.loadGameFile(progressHandler)).toThrow();
	});

	it("throws an error when a sound is loaded", async () => {
		expect(() => subject.loadSound("sound name", progressHandler)).toThrow();
	});
});
