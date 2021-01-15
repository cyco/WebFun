import SizeLike from "./size-like";

class Size implements SizeLike {
	public width: number;
	public height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	get area(): number {
		return this.width * this.height;
	}

	scaleBy(a: number): Size {
		return new Size(this.width * a, this.height * a);
	}

	toString(): string {
		return `Size {${this.width}x${this.height}}`;
	}
}

export default Size;
