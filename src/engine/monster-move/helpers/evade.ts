import { Point } from "src/util";
import MoveCheckResult from "./move-check-result";

export default function evade(direction: Point, val: number): Point {
	switch (val) {
		case MoveCheckResult.OutOfBounds:
		case MoveCheckResult.Blocked:
			return new Point(0, 0);
		case MoveCheckResult.EvadeRight:
			return direction.byAdding(1, 0);
		case MoveCheckResult.EvadeLeft:
			return direction.byAdding(-1, 0);
		case MoveCheckResult.EvadeDown:
			return direction.byAdding(0, 1);
		case MoveCheckResult.EvadeUp:
			return direction.byAdding(0, -1);
		default:
			return direction;
	}
}
