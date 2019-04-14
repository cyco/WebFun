import { Point, Size } from "src/util";

class Sprite {
	public position: Point;
	public size: Size;
	public pixels: Uint8Array;

	constructor(position: Point, size: Size, pixels: Uint8Array) {
		this.position = position;
		this.size = size;
		this.pixels = pixels;
	}
}

export default Sprite;
