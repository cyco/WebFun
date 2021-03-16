import ResourceManager from "src/app/webfun/resource-manager";
import { FetchInputStream, FileLoader, InputStream } from "src/util";
import * as UtilModule from "src/util";
import { ColorPalette } from "src/engine";

describe("WebFun.App.ResourceManager", () => {
	const progressHandler: () => void = () => void 0;
	let subject: ResourceManager;
	let resultStream: FetchInputStream;
	let xhr: XMLHttpRequest;
	let mockResponse: Response;
	let inputStream: InputStream;

	beforeEach(() => {
		resultStream = {} as any;
		mockResponse = {} as any;
		inputStream = new InputStream("");

		spyOn(UtilModule, "FetchInputStream").and.returnValue(resultStream);
		spyOn(FileLoader, "loadAsStream").and.returnValue(Promise.resolve(inputStream));
		spyOn(window, "fetch").and.returnValue(Promise.resolve(mockResponse));
		spyOn(window, "XMLHttpRequest").and.callFake(
			() => (xhr = { open: jasmine.createSpy(), send: jasmine.createSpy() } as any)
		);
		subject = new ResourceManager("palette.data", "data.data", "sound-base");
	});

	it("loads the palette", async () => {
		const mockedBuffer = ({} as unknown) as Uint8Array;
		spyOn(ColorPalette, "FromBGR8");
		spyOn(inputStream, "readUint8Array").and.returnValue(mockedBuffer);

		await subject.loadPalette(progressHandler);

		expect(FileLoader.loadAsStream).toHaveBeenCalled();
		expect(inputStream.readUint8Array).toHaveBeenCalledWith(0x400);
		expect(ColorPalette.FromBGR8).toHaveBeenCalledWith(mockedBuffer);
	});

	it("loads the game data", async () => {
		const result = await subject.loadGameFile(progressHandler);
		expect(window.fetch).toHaveBeenCalledWith("data.data");
		expect(result).toBe(resultStream);
	});

	it("loads sounds according to the base url", async () => {
		const mockedResponse: any = {};
		const resultPromise = subject.loadSound("sound name", progressHandler);
		expect(xhr.open as jasmine.Spy).toHaveBeenCalledWith("GET", "sound-base/sound%20name.mp3");
		expect(xhr.send as jasmine.Spy).toHaveBeenCalledWith();
		expect(xhr.responseType).toBe("arraybuffer");

		(xhr as any).response = mockedResponse;
		(xhr as any).onload();

		expect(await resultPromise).toBe(mockedResponse);
	});
});
