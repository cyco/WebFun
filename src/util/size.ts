import SizeLike from "./size-like";

class Size implements SizeLike {
	public width: number;
	public height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	toString() {
		return `Size {${this.width}x${this.height}}`;
	}

	get area() {
		return this.width * this.height;
	}
}

export default Size;
