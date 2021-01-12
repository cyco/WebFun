import Point from "./point";
import Size from "./size";

class Rectangle {
	origin: Point;
	size: Size;

	constructor(origin: Point, size: Size) {
		this.origin = origin;
		this.size = size;
	}

	get minX(): number {
		return this.origin.x;
	}

	get maxX(): number {
		return this.origin.x + this.size.width;
	}

	get minY(): number {
		return this.origin.y;
	}

	get maxY(): number {
		return this.origin.y + this.size.height;
	}

	get area(): number {
		return this.size.area;
	}

	inset(x: number, y: number): Rectangle {
		return new Rectangle(
			this.origin.byAdding(x, y),
			new Size(this.size.width - 2 * x, this.size.height - 2 * y)
		);
	}

	contains(point: Point): boolean {
		return (
			point.x >= this.minX && point.x < this.maxX && point.y >= this.minY && point.y < this.maxY
		);
	}
}

export default Rectangle;
