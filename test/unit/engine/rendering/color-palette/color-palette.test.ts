import ColorPalette from "src/engine/rendering/color-palette/color-palette";

describe("WebFun.Engine.Rendering.ColorPalette", () => {
	let buffer: ArrayBuffer | SharedArrayBuffer;
	let subject: ColorPalette;
	beforeAll(() => {
		buffer = new Uint8Array([
			...[0, 0, 0, 0], // transparent
			...[0, 0, 0, 0], // black
			...[0, 0, 255, 0], // red
			...[0, 255, 0, 0], // green
			...[255, 0, 0, 0], // blue
			...[255, 0, 255, 0], // pink
			...[255, 255, 255, 0] // white
		]).buffer;
	});

	beforeEach(() => (subject = ColorPalette.FromBGR8Buffer(buffer)));

	it("is a class used to convert color buffers and represent a color palette in general", () => {
		expect(ColorPalette).toBeAClass();
		expect(subject.length).toBe(7);
	});

	it("holds colors in RGBA little endian", () => {
		expect(subject[0]).toBe(0);
		expect(subject[6]).toBe(0xffffffff);
	});

	it("can be copied easily", () => {
		const copy = subject.slice();
		expect(copy.length).toBe(7);
		expect(copy).toEqual(subject);
	});

	it("can return the index of a color", () => {
		expect(subject.findColor(1, 2, 3, 0)).toBe(0);
		expect(subject.findColor(255, 0, 0, 255)).toBe(2);
		expect(subject.findColor(255, 0, 255)).toBe(5);

		subject = ColorPalette.FromBGR8(new Uint8Array());
		expect(subject.findColor(1, 2, 3)).toBe(-1);
	});

	it("can be seriaized to GIMP's palette format", () => {
		expect(subject.toGIMP("test.gpl")).toBe(`GIMP Palette
Name: test.gpl
#
0 0 0 transparent
0 0 0
0 0 255
0 255 0
255 0 0
255 0 255
255 255 255
`);
	});

	it("can be seriaized to Adobe's color table format", () => {
		expect(subject.toAdobeColorTable()).toEqual(
			new Uint8Array([
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				255,
				0,
				255,
				0,
				255,
				0,
				0,
				255,
				0,
				255,
				255,
				255,
				255,
				0,
				1,
				0,
				0
			])
		);
	});
});
