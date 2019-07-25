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

	it("properly rejects the promise when an error occurs", async () => {
		const mockedError: Error = {} as any;
		const mockedFileReder: FileReader = {
			readAsArrayBuffer: () =>
				setTimeout(
					mockedFileReder.onerror(({ type: "error", error: mockedError } as any) as ProgressEvent)
				)
		} as any;
		const originalReader = DOM.FileReader;
		spyOn(DOM, "FileReader").and.returnValue(mockedFileReder);

		try {
			const file = new File(["content"], "my-file");
			const buffer = await file.readAsArrayBuffer();
			expect(false).toBeTrue();
		} catch (e) {
			expect(e).toBe(mockedError);
		}
	});
});
