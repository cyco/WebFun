import download from "src/util/download";

describe("WebFun.Util.download", () => {
	it("initiates the download of an array buffer to the users device", done => {
		const link = document.createElement("a");
		link.onclick = e => {
			e.stopImmediatePropagation();
			e.preventDefault();

			expect(link.getAttribute("download")).toEqual("test-file");
			expect(link.getAttribute("href")).toStartWith("blob:");

			done();
		};
		spyOn(document, "createElement").and.returnValue(link as any);

		const buffer = new ArrayBuffer(5);
		download(buffer, "test-file");
	});

	it("can also download text", done => {
		const link = document.createElement("a");
		link.onclick = e => {
			e.stopImmediatePropagation();
			e.preventDefault();

			expect(link.getAttribute("download")).toEqual("test-file");
			expect(link.getAttribute("href")).toStartWith("blob:");

			done();
		};
		spyOn(document, "createElement").and.returnValue(link as any);

		download("€", "test-file");
	});
});
