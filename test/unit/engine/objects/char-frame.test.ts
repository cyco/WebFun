import CharFrame from "src/engine/objects/char-frame";
import Tile from "src/engine/objects/tile";

describe("CharFrame", () => {
	it("is a class representing one frame of character animation", () => {
		const charFrame = new CharFrame([]);
		expect(charFrame instanceof CharFrame).toBeTrue();
	});

	it("basically wraps an array and offers a more expressive interface", () => {
		const tiles = [
			"up",
			"down",
			"extensionUp",
			"left",
			"extensionDown",
			"extensionLeft",
			"right",
			"extensionRight"
		];

		const charFrame: any = new CharFrame((tiles as any) as Tile[]);

		expect(charFrame.tiles).toBe(tiles);
		expect(charFrame.up).toEqual("up");
		expect(charFrame.down).toEqual("down");
		expect(charFrame.left).toEqual("left");
		expect(charFrame.right).toEqual("right");
		expect(charFrame.extensionUp).toEqual("extensionUp");
		expect(charFrame.extensionDown).toEqual("extensionDown");
		expect(charFrame.extensionLeft).toEqual("extensionLeft");
		expect(charFrame.extensionRight).toEqual("extensionRight");
	});
});
