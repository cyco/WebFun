import PaletteView from "src/app/ui/palette-view";
import { ColorPalette } from "src/engine";
import { OutputStream, Size } from "src/util";

describeComponent(PaletteView, () => {
	let subject: PaletteView;

	const pixels = new Uint8Array([0, 1, 2, 3]);
	const paletteData = new OutputStream(4 * 4);
	paletteData.writeUint8Array([0x00, 0x00, 0x00, 0x00]);
	paletteData.writeUint8Array([0x00, 0x00, 0xff, 0x00]);
	paletteData.writeUint8Array([0x00, 0xff, 0x00, 0x00]);
	paletteData.writeUint8Array([0xff, 0x00, 0x00, 0x00]);

	describe("when shown", () => {
		beforeEach(() => {
			subject = render(PaletteView, {
				style: "width: 2px; height: 2px; position: absolute; display: block;"
			});
			subject.size = new Size(2, 2);
		});
		afterEach(() => subject.remove());

		it("creates a canvas to render the image in", () => {
			expect(subject.querySelector("canvas")).not.toBeNull();
		});

		describe("when an image is set", () => {
			beforeEach(() => {
				subject.image = pixels;
			});

			describe("and a palette is set", () => {
				beforeEach(() => {
					subject.palette = ColorPalette.FromBGR8Buffer(paletteData.buffer);
				});

				it("renders the image", async () => {
					const imageData = subject.renderedImage;
					expect(pixel(0)).toEqual([0x00, 0x00, 0x00, 0]);
					expect(pixel(1)).toEqual([0xff, 0x00, 0x00, 0xff]);
					expect(pixel(2)).toEqual([0x00, 0xff, 0x00, 0xff]);
					expect(pixel(3)).toEqual([0x00, 0, 0xff, 0xff]);

					function pixel(index: number) {
						const i = index * 4;
						const d = imageData.data;
						return [d[i], d[i + 1], d[i + 2], d[i + 3]];
					}
				});
			});
		});
	});
});
