import { Zone } from "src/engine/objects";
import MoveCheckResult from "./move-check-result";
import { Point } from "src/util";
import { Engine } from "src/engine";

export const EvasionStrategy = (tickCount: number) => ((tickCount & 1) < 1 ? 1 : -1);

export default (source: Point, rel: Point, zone: Zone, flag = false, engine: Engine): MoveCheckResult => {
	const target = source.byAdding(rel);

	if (!zone.bounds.contains(target)) {
		return MoveCheckResult.OutOfBounds;
	}

	if (!zone.getTile(target.x, target.y, Zone.Layer.Object)) {
		return MoveCheckResult.Free;
	}

	const isFree = (evade: Point) => {
		const checkTarget = target.byAdding(evade);

		return zone.bounds.contains(checkTarget) && (flag || !zone.getTile(checkTarget.x, checkTarget.y, Zone.Layer.Object));
	};

	const evade = EvasionStrategy(engine.metronome.tickCount);
	if (rel.x && !rel.y && isFree(new Point(0, -evade))) {
		return MoveCheckResult.EvadeUp;
	}
	if (rel.x && !rel.y && isFree(new Point(0, evade))) {
		return MoveCheckResult.EvadeDown;
	}
	if (rel.x && !rel.y) {
		return MoveCheckResult.Blocked;
	}

	if (!rel.x && rel.y && isFree(new Point(-evade, 0))) {
		return MoveCheckResult.EvadeLeft;
	}
	if (!rel.x && rel.y && isFree(new Point(evade, 0))) {
		return MoveCheckResult.EvadeRight;
	}
	if (!rel.x && rel.y) {
		return MoveCheckResult.Blocked;
	}

	if (rel.x < 0 && isFree(new Point(1, 0))) {
		return MoveCheckResult.EvadeRight;
	}
	if (rel.x >= 0 && isFree(new Point(-1, 0))) {
		return MoveCheckResult.EvadeLeft;
	}
	if (rel.y < 0 && isFree(new Point(0, 1))) {
		return MoveCheckResult.EvadeDown;
	}
	if (rel.y >= 0 && isFree(new Point(0, -1))) {
		return MoveCheckResult.EvadeUp;
	}

	return MoveCheckResult.Blocked;
};
