import drawZoneImageData from "src/app/rendering/canvas/draw-zone-image-data";
import { ColorPalette } from "src/engine/rendering";
import { Tile, Zone } from "src/engine/objects";
import { Size } from "src/util";

describe("WebFun.App.Rendering.Canvas.DrawZoneImageData", () => {
	let colorPalette: ColorPalette;
	beforeAll(() => {
		const paletteData = new Uint8Array([...[0, 0, 0], ...[255, 0, 0], ...[0, 255, 0], ...[0, 0, 255]]);
		colorPalette = ColorPalette.FromBGR8(paletteData, 3);
	});

	it("creates an image data object by drawing each tile of each layer of the zone", () => {
		const tiles: Tile[][][] = [
			[[t(0), null, null], [null, t(1), null], [null, null, t(2)]],
			[[null, null, null], [t(1), t(2), t(3)], [t(0), t(0), t(0)]],
			[[t(0), t(0), t(0)], [t(0), t(0), t(0)], [t(0), t(0), t(0)]]
		];
		const zone = ({
			size: new Size(3, 3),
			getTile(x: number, y: number, z: number) {
				return tiles[y][x][z];
			}
		} as any) as Zone;
		const result = drawZoneImageData(zone, colorPalette);
		expect(result.width).toBe(96);
		expect(result.height).toBe(96);

		const canvas = document.createElement("canvas");
		canvas.width = 96;
		canvas.height = 96;
		const ctx = canvas.getContext("2d");
		ctx.putImageData(result, 0, 0);

		expect(getColor(ctx, 0, 0)).toEqual("#000000", "tile 0 at 0x0");
		expect(getColor(ctx, 32, 0)).toEqual("#0000ff", "tile 1 at 1x0");
		expect(getColor(ctx, 64, 0)).toEqual("#00ff00", "tile 2 at 2x0");
		expect(getColor(ctx, 0, 32)).toEqual("#000000", "no tile at 0x1");
	});

	it("returns a very small and empty image data if null is passed in", () => {
		const result = drawZoneImageData(null, colorPalette);
		expect(result.width).toBe(1);
		expect(result.height).toBe(1);
	});

	function t(color: number): Tile {
		return ({ imageData: Uint8Array.from(Array.Repeat(color, 32 * 32)) } as any) as Tile;
	}

	function getColor(ctx: CanvasRenderingContext2D, x: number, y: number): string {
		const d = ctx.getImageData(x, y, 1, 1).data;
		return "#" + ((d[0] << 16) | (d[1] << 8) | d[2]).toString(0x10).padStart(6, "0");
	}
});
