import Point from "./point";
import PointRange from "./point-range";

export default class VerticalPointRange extends PointRange {
	constructor(from: number, to: number, x:number) {
		super(x, from, x, to);
	}

	iterate(callback: (_: Point, control: any) => void, step = 1): void {
		super.iterate(callback, new Point(0, step));
	}

	find(callback: (_: Point) => boolean, step = 1): Point {
		return super.find(callback, new Point(0, step));
	}
}
