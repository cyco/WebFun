import DownloadImage from "src/util/download-image";

describe("WebFun.Util.DownloadImage", () => {
	const sampleData = new ImageData(
		new Uint8ClampedArray([
			...[...[0x00, 0x00, 0x00, 0xff], ...[0xff, 0xff, 0xff, 0xff]],
			...[...[0x00, 0xff, 0x00, 0xff], ...[0xff, 0x00, 0xff, 0xff]]
		]),
		2,
		2
	);

	it("is a helper function to download an `ImageData` object as image", () => {
		const canvas = document.createElement("canvas");
		const link = document.createElement("a");
		spyOn(document, "createElement").and.callFake((tag: string): any =>
			tag === "canvas" ? canvas : link
		);
		spyOn(link, "click");

		DownloadImage(sampleData, "Test.jpg", "jpeg");

		expect(link.getAttribute("download")).toEqual("Test.jpg");
		expect(link.getAttribute("href")).toStartWith("data:image/jpeg;base64");
		expect(link.getAttribute("href").length).toBe(1243);
		expect(link.click).toHaveBeenCalled();
	});

	it("by default, images are downloaded as png", () => {
		const canvas: HTMLCanvasElement = document.createElement("canvas");
		const link = document.createElement("a");
		spyOn(document, "createElement").and.callFake((tag: string): any =>
			tag === "canvas" ? canvas : link
		);
		spyOn(link, "click");

		DownloadImage(sampleData, "Test.png");

		expect(link.getAttribute("download")).toEqual("Test.png");
		expect(link.getAttribute("href")).toStartWith("data:image/png;base64");
		expect(link.getAttribute("href").length).toBe(146);
	});

	it("does nothing if no content is given", () => {
		spyOn(document, "createElement");
		DownloadImage(null, "Test.png");
		expect(document.createElement).not.toHaveBeenCalled();
	});
});
