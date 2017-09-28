import Point from "./point";
import PointRange from "./point-range";

class HorizontalPointRange extends PointRange {
	constructor(from: number, to: number, y: number) {
		super(from, y, to, y);
	}

	iterate(callback: (_: Point, control: any) => void, step = 1): void {
		super.iterate(callback, new Point(step, 0));
	}

	find(callback: (_: Point) => boolean, step = 1): Point {
		return super.find(callback, new Point(step, 0));
	}
}

export default HorizontalPointRange;
