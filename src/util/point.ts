import PointLike from "./point-like";
import SizeLike from "./size-like";
import { abs } from "src/std/math";

class Point implements PointLike {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number | PointLike, y: number = null, z: number = null) {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}

		this.x = x;
		this.y = y;
		this.z = z;
	}

	public static add(p1: PointLike, p2: PointLike): Point {
		return new Point(p1.x + p2.x, p1.y + p2.y, p1.z);
	}

	public static subtract(p1: PointLike, p2: PointLike): Point {
		return new Point(p1.x - p2.x, p1.y - p2.y, p1.z);
	}

	public clone(): Point {
		return new Point(this.x, this.y, this.z);
	}

	public add(x: number | PointLike, y: number = null): this {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		this.x += x;
		this.y += y;

		return this;
	}

	public comparedTo(point: Point): Point {
		let x = 0;
		let y = 0;

		if (this.x !== point.x) x = this.x < point.x ? -1 : 1;
		if (this.y !== point.y) y = this.y < point.y ? -1 : 1;

		return new Point(x, y);
	}

	public byAdding(x: number | PointLike, y: number = null): Point {
		return new Point(this).add(x, y);
	}

	public subtract(x: number | PointLike, y?: number): this {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		this.x -= x;
		this.y -= y;

		return this;
	}

	public bySubtracting(x: number | PointLike, y: number = null): Point {
		return new Point(this).subtract(x, y);
	}

	public scaleBy(a: number): this {
		this.x *= a;
		this.y *= a;

		return this;
	}

	public dividedBy(size: SizeLike): Point {
		return new Point(this.x / size.width, this.y / size.height, this.z);
	}

	public byScalingBy(a: number): Point {
		return new Point(this).scaleBy(a);
	}

	public floor(): this {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);

		return this;
	}

	public byFlooring(): Point {
		return new Point(this).floor();
	}

	public ceil(): this {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);

		return this;
	}

	public byCeiling(): Point {
		return new Point(this).ceil();
	}

	public abs(): this {
		this.x = abs(this.x);
		this.y = abs(this.y);

		return this;
	}

	public byAbsing(): Point {
		return new Point(this).abs();
	}

	public isEqualTo(point: PointLike): boolean {
		return !!(
			point &&
			this.x === point.x &&
			this.y === point.y &&
			(this.z === null || this.z === undefined || point.z === null || point.z === undefined || this.z === point.z)
		);
	}

	public isUnidirectional(): boolean {
		return this.x === 0 || this.y === 0;
	}

	public isInBounds(size: SizeLike): boolean {
		return this.x >= 0 && this.y >= 0 && this.x < size.width && this.y < size.height;
	}

	public isZeroPoint(): boolean {
		return this.x === 0 && this.y === 0;
	}

	public distanceTo(point: Point): number {
		const x = this.x - point.x;
		const y = this.y - point.y;

		return Math.sqrt(x ** 2 + y ** 2);
	}

	public manhattenDistanceTo(point: Point): number {
		return abs(this.x - point.x) + abs(this.y - point.y);
	}

	public toString(): string {
		return `Point {${this.x}x${this.y}}`;
	}
}

export default Point;
