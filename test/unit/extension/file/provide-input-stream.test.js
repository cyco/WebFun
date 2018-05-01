import { File } from "src/std.dom";
import provideInputStream from "src/extension/file/provide-input-stream";

describe("WebFun.Extension.File.provideInputStream", () => {
	it("extends the File prototype", () => {
		const file = new File(["content"], "my-file");
		expect(file.provideInputStream).toBeFunction();
	});

	it("provides the file's content as an input stream", async done => {
		const file = new File(["content"], "my-file");
		const stream = await file.provideInputStream();
		expect(stream.getCharacters(3)).toEqual("con");
		done();
	});
});
