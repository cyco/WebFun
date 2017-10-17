import PointLike from "./point-like";
import SizeLinke from "./size-like";

class Point implements PointLike {
	public x: number;
	public y: number;
	public z: number;

	static add(p1: PointLike, p2: PointLike): Point {
		return new Point(p1.x + p2.x, p1.y + p2.y, p1.z);
	}

	static subtract(p1: PointLike, p2: PointLike): Point {
		return new Point(p1.x - p2.x, p1.y - p2.y, p1.z);
	}

	constructor(x: number|PointLike, y: number = null, z: number = null) {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public clone(): Point {
		return new Point(this.x, this.y, this.z);
	}

	add(x: number|PointLike, y: number = null): this {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		this.x += x;
		this.y += y;

		return this;
	}

	byAdding(x: number, y: number): Point {
		return (new Point(this)).add(x, y);
	}

	subtract(x: number|PointLike, y: number): this {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		this.x -= x;
		this.y -= y;

		return this;
	}

	bySubtracting(x: number, y: number): Point {
		return (new Point(this)).subtract(x, y);
	}

	scaleBy(a: number): this {
		this.x *= a;
		this.y *= a;

		return this;
	}

	byScalingBy(a: number): Point {
		return (new Point(this)).scaleBy(a);
	}

	floor(): this {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);

		return this;
	}

	byFlooring(): Point {
		return (new Point(this)).floor();
	}

	ceil(): this {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);

		return this;
	}

	byCeiling(): Point {
		return (new Point(this)).ceil();
	}

	abs(): this {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);

		return this;
	}

	byAbsing(): Point {
		return (new Point(this)).abs();
	}

	isEqualTo(point: PointLike): boolean {
		return !!(point && this.x === point.x && this.y === point.y && this.z === point.z);
	}

	isUnidirectional(): boolean {
		return this.x === 0 || this.y === 0;
	}

	isInBounds(size: SizeLinke): boolean {
		return this.x >= 0 && this.y >= 0 && this.x < size.width && this.y < size.height;
	}

	isZeroPoint(): boolean {
		return this.x === 0 && this.y === 0;
	}

	toString(): string {
		return `Point {${this.x}x${this.y}}`;
	}
}

export default Point;
