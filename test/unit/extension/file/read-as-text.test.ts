import { File } from "src/std/dom";
import * as DOM from "src/std/dom";
import readAsText from "src/extension/file/read-as-text";

describe("WebFun.Extension.File.readAsText", () => {
	let file: File;
	beforeEach(() => {
		file = new File("Hello World!".split(""), "b");
	});

	it("extends the File class to allow reading text from files with a nice interface", () => {
		expect(file.readAsText).toBe(readAsText);
	});

	it("returns the text from the file", async () => {
		const text = await file.readAsText();
		expect(text).toEqual("Hello World!");
	});

	it("rejects the promise if anything goes wrong", async () => {
		const mockedError = {};
		const mockedFileReader = {
			readAsText() {
				this.onerror({ error: mockedError });
			}
		};
		spyOn(DOM, "FileReader").and.returnValue(mockedFileReader);
		try {
			await file.readAsText();
			expect(false).toBeTrue();
		} catch (e) {
			expect(e).toBe(mockedError);
		}
	});
});
