import drawTileImageData from "src/app/webfun/rendering/canvas/draw-tile-image-data";
import { ColorPalette } from "src/engine/rendering";
import * as drawImage from "src/app/webfun/rendering/canvas/draw-image";
import { Tile } from "src/engine/objects";

describe("WebFun.App.Rendering.Canvas.DrawTileImageData", () => {
	const mockPalette = ({} as any) as ColorPalette;
	const mockTile = ({} as any) as Tile;

	it("returns a small empty image data object if tile is null", () => {
		const result = drawTileImageData(null, mockPalette);
		expect(result.height).toBe(1);
		expect(result.width).toBe(1);
	});

	it("draws the tile image using draw-image helper", () => {
		spyOn(drawImage, "default");
		drawTileImageData(mockTile, mockPalette);
		expect(drawImage.default).toHaveBeenCalled();
	});
});
