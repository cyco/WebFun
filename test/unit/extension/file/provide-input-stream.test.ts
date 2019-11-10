import provideInputStream from "src/extension/file/provide-input-stream";

describe("WebFun.Extension.File.provideInputStream", () => {
	it("extends the File prototype", () => {
		const file = new File(["content"], "my-file");
		expect(file.provideInputStream).toBeFunction();
	});

	it("provides the file's content as an input stream", async () => {
		const file = new File(["content"], "my-file");
		const stream = await file.provideInputStream();
		expect(stream.readCharacters(3)).toEqual("con");
	});
});
