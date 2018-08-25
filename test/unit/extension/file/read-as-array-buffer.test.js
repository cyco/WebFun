import { File } from "src/std.dom";
import * as DOM from "src/std.dom";
import readAsArrayBuffer from "src/extension/file/read-as-array-buffer";

describe("WebFun.Extension.File.readAsArrayBuffer", () => {
	it("extends the File prototype", () => {
		const file = new File(["content"], "my-file");
		expect(file.readAsArrayBuffer).toBeFunction();
	});

	it("provides the file's content as an array buffer", async done => {
		const file = new File(["content"], "my-file");
		const buffer = await file.readAsArrayBuffer();
		expect(buffer.byteLength).toEqual("content".length);

		done();
	});

	it("properly rejects the promise when an error occurs", async done => {
		const mockedError = {};
		const mockedFileReder = {
			readAsArrayBuffer: () => setTimeout(mockedFileReder.onerror(new ErrorEvent(mockedError)))
		};
		const originalReader = DOM.FileReader;
		DOM.FileReader = () => mockedFileReder;

		try {
			const file = new File(["content"], "my-file");
			const buffer = await file.readAsArrayBuffer();
			expect(false).toBeTrue();
		} catch (e) {
			expect(e.error).toBe(mockedError);
		} finally {
			DOM.FileReader = originalReader;
			done();
		}
	});
});
