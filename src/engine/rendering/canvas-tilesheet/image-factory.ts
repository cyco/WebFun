import Image from "src/engine/rendering/image";
import TileSheet from "./tile-sheet";
import Tile from "src/engine/objects/tile";
import DOMImageFactory from "../canvas/dom-image-factory";

class ImageFactory extends DOMImageFactory {
	private sheet: TileSheet;

	public prepare(count: number) {
		this.sheet = new TileSheet(count);
	}

	public finalize() {
		this.sheet.draw(this);
	}

	public buildImage(width: number, height: number, pixelData: Uint8Array): Image {
		if (width === Tile.WIDTH && height === Tile.HEIGHT) {
			const entry = this.sheet.add(pixelData);
			return new Image(width, height, entry);
		}

		return super.buildImage(width, height, pixelData);
	}
}

export default ImageFactory;
