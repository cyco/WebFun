import { Zone } from "src/engine/objects";
import MoveCheckResult from "./move-check-result";
import { Point } from "src/util";
import moveCheck from "./move-check";

export default (source: Point, rel: Point, zone: Zone): Point => {
	const result = moveCheck(source, rel, zone, false);
	switch (result) {
		case MoveCheckResult.OutOfBounds:
		case MoveCheckResult.Blocked:
			return rel.byAdding(0, 0);
		case MoveCheckResult.EvadeRight:
			return rel.byAdding(1, 0);
		case MoveCheckResult.EvadeLeft:
			return rel.byAdding(-1, 0);
		case MoveCheckResult.EvadeDown:
			return rel.byAdding(0, 1);
		case MoveCheckResult.EvadeUp:
			return rel.byAdding(0, -1);
		case MoveCheckResult.Free:
			return rel;
		default:
			console.assert(false);
	}
};
