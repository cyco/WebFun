export default class Point {
	static add(p1, p2) {
		return new Point(p1.x + p2.x, p1.y + p2.y, p1.z);
	}

	static subtract(p1, p2) {
		return new Point(p1.x - p2.x, p1.y - p2.y, p1.z);
	}

	constructor(x, y, z) {
		if (typeof x === "object") {
			y = x.y;
			z = x.z;
			x = x.x;
		}
		this.x = x;
		this.y = y;
		this.z = z;

		Object.seal(this);
	}

	add(x, y) {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		this.x += x;
		this.y += y;

		return this;
	}

	subtract(x, y) {
		if (typeof x === "object") {
			y = x.y;
			x = x.x;
		}

		this.x -= x;
		this.y -= y;

		return this;
	}

	scaleBy(a) {
		this.x *= a;
		this.y *= a;

		return this;
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);

		return this;
	}

	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);

		return this;
	}

	abs() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);

		return this;
	}

	isEqualTo(point) {
		return point && this.x === point.x && this.y === point.y && this.z === point.z;
	}

	isUnidirectional() {
		return this.x === 0 || this.y === 0;
	}

	isInBounds(size) {
		return this.x >= 0 && this.y >= 0 && this.x < size.width && this.y < size.height;
	}

	isZeroPoint() {
		return this.x === 0 && this.y === 0;
	}

	toString() {
		return `Point {${this.x}x${this.y}}`;
	}
}

window.Point = Point;