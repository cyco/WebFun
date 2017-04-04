import Point from './point';

export default class PointRange {
	constructor(fromX, fromY, toX, toY) {
		if (typeof fromX !== 'object') {
			fromX = new Point(fromX, fromY);
			fromY = new Point(toX, toY);
		}

		this.from = fromX;
		this.to = fromY;
	}

	iterate(callback, step = new Point(1, 1)) {
		const point = new Point(this.from);
		const control = { stop: false, step: step };

		let xcmp = step.x >= 0 ? (a,b) => a.x <= b.x : (a,b) => b.x <= a.x;
		let ycmp = step.y >= 0 ? (a,b) => a.y <= b.y : (a,b) => b.y <= a.y;
		
		while (xcmp(point, this.to) && ycmp(point, this.to)) {
			callback(point, control);
			if (control.stop) return;

			point.add(step);
		}
	}
}
