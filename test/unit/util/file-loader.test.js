import FileLoader from "/util/file-loader";

describe("FileLoader", () => {
	let subject = null;
	beforeEach(() => {
		subject = new FileLoader();
	});

	it("is a class", () => {
		expect(FileLoader).toBeClass();
	});

	it("is used to crete an input stream from a file", () => {
		subject = new FileLoader("asciiString");
	});
});
