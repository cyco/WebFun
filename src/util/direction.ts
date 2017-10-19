import Point from "./point";

class Direction {
	public static readonly East = 0;
	public static readonly SouthEast = 45;
	public static readonly South = 90;
	public static readonly SouthWest = 135;
	public static readonly West = 180;
	public static readonly NorthWest = 225;
	public static readonly North = 270;
	public static readonly NorthEast = 315;

	static Normalize(direction: number): number {
		let result = direction % 360.0;
		if (result < 0)
			result += 360.0;
		return result;
	}

	static Confine(direction: number): number {
		return Direction.Normalize(Math.round(direction / 45.0) * 45.0);
	}

	static CalculateAngleFromRelativePoint(relative: Point): number {
		if (relative.x < 0)
			return 180.0 - Math.atan(relative.y / -relative.x) * 180.0 / Math.PI;
		else
			return Math.atan(relative.y / relative.x) * 180.0 / Math.PI;
	}

	static CalculateRelativeCoordinates(direction: number, distance: number): Point {
		let rad = direction * Math.PI / 180.0;
		return new Point(distance * Math.round(Math.cos(rad)), distance * Math.round(Math.sin(rad)));
	}

	constructor() {
		throw "static class";
	}
}

export default Direction;
