export default class Direction {
	static Normalize(direction) {
		let result = direction % 360.0;
		if (result < 0)
			result += 360.0;
		return result;
	}

	static Confine(direction) {
		return Direction.Normalize(Math.round(direction / 45.0) * 45.0);
	}

	static CalculateAngleFromRelativePoint(relative) {
		if (relative.x < 0)
			return 180.0 - Math.atan(relative.y / -relative.x) * 180.0 / Math.PI;
		else
			return Math.atan(relative.y / relative.x) * 180.0 / Math.PI;
	}

	static CalculateRelativeCoordinates(direction, distance) {
		let rad = direction * Math.PI / 180.0;
		return {
			x: distance * Math.round(Math.cos(rad)),
			y: distance * Math.round(Math.sin(rad))
		};
	}

	constructor() {
		throw "static class";
	}
}

Direction.East = 0;
Direction.SouthEast = 45;
Direction.South = 90;
Direction.SouthWest = 135;
Direction.West = 180;
Direction.NorthWest = 225;
Direction.North = 270;
Direction.NorthEast = 315;