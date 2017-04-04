import Point from './point';
import PointRange from './point-range';

export default class HorizontalPointRange extends PointRange {
	constructor(from, to, y) {
		super(from, y, to, y);
	}

	iterate(callback, step = 1) {
		super.iterate(callback, new Point(step, 0));
	}
}
