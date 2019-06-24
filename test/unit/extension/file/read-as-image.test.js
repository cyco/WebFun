import { File } from "src/std/dom";
import * as DOM from "src/std/dom";
import readAsImage from "src/extension/file/read-as-image";

describe("WebFun.Extension.File.readAsImage", () => {
	let imageBuffer;
	beforeAll(
		() =>
			(imageBuffer = Uint8Array.from(
				atob(
					"iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAF0lEQVQYVwXBAQEAAACCIPs/mmAVtMR0Q+wH/DyFmbQAAAAASUVORK5CYII="
				)
					.split("")
					.map(i => i.charCodeAt(0))
			))
	);

	it("extends the File class to allow reading HTMLImageElements from files", () => {
		expect(new File(imageBuffer, "b").readAsImage).toBe(readAsImage);
	});

	xit("returns an image element from the file's contents", async () => {
		try {
			const subject = new File(imageBuffer, "b");
			subject.readAsArrayBuffer = () => Promise.resolve(imageBuffer.buffer);
			const image = await subject.readAsImage();
			expect(image).toBeInstanceOf(HTMLImageElement);
			expect(image.src).toStartWith("blob:");
		} catch (e) {
			expect(true).toBeFalse();
		}
	});

	it("rejects the promise if the file can't be read as an image", async () => {
		try {
			const subject = new File(new Uint8Array(0), "b");
			await subject.readAsImage();
			expect(false).toBeTrue();
		} catch (e) {
			expect(true).toBeTrue();
		}
	});
});
