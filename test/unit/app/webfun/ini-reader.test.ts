import IniReader, { IniFile } from "src/app/webfun/ini-reader";

describe("WebFun.App.IniReader", () => {
	const ini = `
		firstKey=4
		secondKey=5

		[MySection]
		sectionKey=My Section

		[Another Section]
		key=value
		key2=4

		[Empty Section]
	`;
	let subject: IniReader;

	describe("parsing a well-formed file", () => {
		let contents: IniFile;

		beforeEach(() => {
			subject = new IniReader({ lineSeparator: "\n" });
			contents = subject.readFromString(ini);
		});

		it("reads the correct number of keys", () => {
			expect(Object.keys(contents).length).toBe(5);
		});

		it("reads keys outside of sections", () => {
			expect(contents["firstKey"]).toEqual("4");
			expect(contents["secondKey"]).toEqual("5");
		});

		it("reads keys within sections", () => {
			expect(contents["MySection.sectionKey"]).toEqual("My Section");
		});

		it("does not use case sensitive keys", () => {
			expect(contents["mysection.SectionKey"]).toEqual("My Section");
		});
	});
});
