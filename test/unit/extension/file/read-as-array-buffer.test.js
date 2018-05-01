import { File } from "src/std.dom";
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
});
