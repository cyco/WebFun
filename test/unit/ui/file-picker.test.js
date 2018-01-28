import FilePicker from "src/ui/file-picker";

describe("FilePicker", () => {
	afterEach(() => {
		if (document.body.onfocus) document.body.onfocus();
	});

	it("is a class used to prompt the user for a file", () => {
		expect(FilePicker).toBeAClass();
	});

	it("creates a hidden file input element and automatically clicks it", () => {
		const picker = new FilePicker();
		picker.pickFile();

		expect(document.querySelector('input[type="file"]')).not.toBeNull();
	});

	it("has a static function to allow picking files in a functional manner", () => {
		const promise = FilePicker.Pick({});
		expect(document.querySelector('input[type="file"]')).not.toBeNull();
	});

	it("configures the input element based on the configuration", () => {
		const options = { allowsMultipleFiles: true, allowedTypes: [".wld", ".sav"] };
		const picker = new FilePicker(options);
		picker.pickFile();

		const input = document.querySelector('input[type="file"]');
		expect(input.multiple).toBeTrue();
		expect(input.accept).toEqual(".wld,.sav");
	});

	it("resolves to an empty array if no files were picked", done => {
		const promise = FilePicker.Pick({});
		promise.then(files => {
			expect(files).toBeEmptyArray();
			done();
		});
		document.body.onfocus();
	});
});
