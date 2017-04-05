import Point from "./point";
import PointRange from "./point-range";

export default class VerticalPointRange extends PointRange {
	constructor(from, to, x) {
		super(x, from, x, to);
	}

	iterate(callback, step = 1) {
		super.iterate(callback, new Point(0, step));
	}
}