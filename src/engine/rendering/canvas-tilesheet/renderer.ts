import CanvasRenderer from "src/engine/rendering/canvas/canvas-renderer";
import ImageFactory from "src/engine/rendering/canvas-tilesheet/image-factory";
import { TileSheetEntry } from "src/engine/rendering/canvas-tilesheet/tile-sheet";

class Renderer extends CanvasRenderer {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);

		this._imageFactory = new ImageFactory();
	}

	protected drawImage(image: HTMLImageElement | TileSheetEntry, atX: number, atY: number) {
		if (image instanceof HTMLImageElement) {
			this._ctx.drawImage(image, atX, atY);
		} else {
			const sheetImage = image.sheet.sheetImage;
			const rectangle = image.rectangle;

			const width = rectangle.size.width;
			const height = rectangle.size.height;
			this._ctx.drawImage(
				sheetImage,
				rectangle.minX,
				rectangle.minY,
				width,
				height,
				atX,
				atY,
				width,
				height
			);
		}
	}
}

export default Renderer;
