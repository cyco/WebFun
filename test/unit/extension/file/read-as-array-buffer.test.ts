import { File } from "src/std/dom";
import * as DOM from "src/std/dom";
import readAsArrayBuffer from "src/extension/file/read-as-array-buffer";

describe("WebFun.Extension.File.readAsArrayBuffer", () => {
	it("extends the File prototype", () => {
		const file = new File(["content"], "my-file");
		expect(file.readAsArrayBuffer).toBeFunction();
	});

	it("provides the file's content as an array buffer", async () => {
		const file = new File(["content"], "my-file");
		const buffer = await file.readAsArrayBuffer();
		expect(buffer.byteLength).toEqual("content".length);
	});

	it("properly rejects the promise if an error occurs", async () => {
		const mockedError: Error = {} as any;
		const mockedFileReader: FileReader = {
			readAsArrayBuffer() {
				const error: ProgressEvent<FileReader> = { type: "error", error: mockedError } as any;
				setTimeout(() => mockedFileReader.onerror(error));
			}
		} as any;
		spyOn(DOM, "FileReader").and.returnValue(mockedFileReader);

		try {
			const file = new File(["content"], "my-file");
			await file.readAsArrayBuffer();
			fail("readAsArrayBuffer should have thrown an exception");
		} catch (e) {
			expect(e).toBe(mockedError);
		}
	});
});
