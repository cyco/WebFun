import Point from "./point";

class PointRange {
	public from: Point;
	public to: Point;

	constructor(
		fromX: number | Point,
		fromY: number | Point,
		toX: number = null,
		toY: number = null
	) {
		if (typeof fromX !== "object") {
			fromX = new Point(fromX, fromY as number);
			fromY = new Point(toX, toY);
		}

		this.from = fromX;
		this.to = fromY as Point;
	}

	iterate(callback: (_: Point, control: any) => void, step: any = new Point(1, 1)): void {
		const point = new Point(this.from);
		const control = {
			stop: false,
			step: step
		};

		const xcmp =
			step.x >= 0 ? (a: Point, b: Point) => a.x <= b.x : (a: Point, b: Point) => b.x <= a.x;
		const ycmp =
			step.y >= 0 ? (a: Point, b: Point) => a.y <= b.y : (a: Point, b: Point) => b.y <= a.y;

		while (xcmp(point, this.to) && ycmp(point, this.to)) {
			callback(point, control);
			if (control.stop) return;

			point.add(step);
		}
	}

	find(callback: (_: Point) => boolean, step: any = new Point(1, 1)): Point {
		const point = new Point(this.from);

		const xcmp =
			step.x >= 0 ? (a: Point, b: Point) => a.x <= b.x : (a: Point, b: Point) => b.x <= a.x;
		const ycmp =
			step.y >= 0 ? (a: Point, b: Point) => a.y <= b.y : (a: Point, b: Point) => b.y <= a.y;

		while (xcmp(point, this.to) && ycmp(point, this.to)) {
			if (callback(point)) return point;

			point.add(step);
		}

		return null;
	}
}

export default PointRange;
