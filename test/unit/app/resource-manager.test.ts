import ResourceManager from "src/app/resource-manager";
import { FileLoader, InputStream } from "src/util";
import { ColorPalette } from "src/engine";

describe("WebFun.App.ResourceManager", () => {
	const progressHandler: () => void = () => void 0;
	let subject: ResourceManager;
	let resultStream: InputStream;

	beforeEach(() => {
		resultStream = new InputStream("");
		spyOn(FileLoader, "loadAsStream").and.returnValue(Promise.resolve(resultStream));
		subject = new ResourceManager("palette.data", "data.data", "sound-base");
	});

	it("loads the palette", async () => {
		const mockedBuffer = ({} as unknown) as Uint8Array;
		spyOn(ColorPalette, "FromBGR8");
		spyOn(resultStream, "getUint8Array").and.returnValue(mockedBuffer);

		await subject.loadPalette(progressHandler);

		expect(FileLoader.loadAsStream).toHaveBeenCalled();
		expect(resultStream.getUint8Array).toHaveBeenCalledWith(0x400);
		expect(ColorPalette.FromBGR8).toHaveBeenCalledWith(mockedBuffer);
	});

	it("loads the game data", async () => {
		const result = await subject.loadGameFile(progressHandler);
		expect(FileLoader.loadAsStream).toHaveBeenCalled();
		expect(result).toBe(resultStream);
	});

	xit("loads sounds according to the base url", async () => {
		const result = await subject.loadSound("sound name", progressHandler);
		expect(FileLoader.loadAsStream).toHaveBeenCalled();
		// expect(result).toBe(resultStream);
	});
});
