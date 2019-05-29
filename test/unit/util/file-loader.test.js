import FileLoader from "src/util/file-loader";
import InputStream from "src/util/input-stream";

describe("WebFun.Util.FileLoader", () => {
	it("is a class", () => {
		expect(FileLoader).toBeClass();
	});

	it("is used to crete an input stream from a file", async done => {
		const result = await FileLoader.loadAsStream("base/test/fixtures/asciiString");

		expect(result).toBeInstanceOf(InputStream);
		expect(result.length).toBe(27);
		result.seek(2);
		expect(result.getCharacters(5)).toBe("ASCII");

		done();
	});

	it("rejects the promise if the file can't be read", async done => {
		try {
			await FileLoader.loadAsStream("missing file");
			expect(false).toBeTrue();
		} catch (e) {
			expect(true).toBeTrue();
		}

		done();
	});

	it("rejects the promise if the url is invalid ", async done => {
		try {
			await FileLoader.loadAsStream("scheme://something.local");
			expect(false).toBeTrue();
		} catch (e) {
			console.log(e);
			expect(true).toBeTrue();
		}

		done();
	});
});
