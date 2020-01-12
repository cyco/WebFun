import Point from "./point";
import { atan, PI, round, sin, cos } from "src/std/math";

class Direction {
	public static readonly East = 0;
	public static readonly SouthEast = 45;
	public static readonly South = 90;
	public static readonly SouthWest = 135;
	public static readonly West = 180;
	public static readonly NorthWest = 225;
	public static readonly North = 270;
	public static readonly NorthEast = 315;

	constructor() {
		throw "static class";
	}

	static Normalize(direction: number): number {
		let result = direction % 360.0;
		if (result < 0) result += 360.0;
		return result;
	}

	static Confine(direction: number, allowDiagonals = true): number {
		const value = Direction.Normalize(round(direction / 45.0) * 45.0);

		if (!allowDiagonals) {
			switch (value) {
				case Direction.East:
					return Direction.East;
				case Direction.SouthEast:
				case Direction.South:
				case Direction.SouthWest:
					return Direction.South;
				case Direction.West:
					return Direction.West;
				case Direction.NorthWest:
				case Direction.North:
				case Direction.NorthEast:
					return Direction.North;
			}
		}

		return value;
	}

	static CalculateAngleFromRelativePoint(relative: Point): number {
		if (relative.x < 0) return 180.0 - (atan(relative.y / -relative.x) * 180.0) / PI;
		else return (atan(relative.y / relative.x) * 180.0) / PI;
	}

	static CalculateRelativeCoordinates(direction: number, distance: number): Point {
		const rad = (direction * PI) / 180.0;
		return new Point(distance * round(cos(rad)), distance * round(sin(rad)));
	}
}

export default Direction;
