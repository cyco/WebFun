import FileLoader from "src/util/file-loader";
import InputStream from "src/util/input-stream";

describe("WebFun.Util.FileLoader", () => {
	it("is a class", () => {
		expect(FileLoader).toBeClass();
	});

	it("is used to crete an input stream from a file", async () => {
		const result = await FileLoader.loadAsStream("base/test/fixtures/asciiString");

		expect(result).toBeInstanceOf(InputStream);
		expect(result.length).toBe(27);
		result.seek(2);
		expect(result.readCharacters(5)).toBe("ASCII");
	});

	it("can report the loading progress back to the caller", async () => {
		const progressCallback = jasmine.createSpy("spy");
		await FileLoader.loadAsStream("base/test/fixtures/asciiString", progressCallback);

		expect(progressCallback).toHaveBeenCalledWith(0);
		expect(progressCallback).toHaveBeenCalledWith(1);
	});

	it("rejects the promise if the file can't be read", async () => {
		try {
			await FileLoader.loadAsStream("missing file");
			expect(false).toBeTrue();
		} catch (e) {
			expect(true).toBeTrue();
		}
	});

	it("rejects the promise if the url is invalid ", async () => {
		try {
			await FileLoader.loadAsStream("scheme://something.local");
			expect(false).toBeTrue();
		} catch (e) {
			expect(true).toBeTrue();
		}
	});
});
