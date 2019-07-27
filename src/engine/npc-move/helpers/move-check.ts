import { Zone } from "src/engine/objects";
import MoveCheckResult from "./move-check-result";
import { Point } from "src/util";

export const EvasionStrategy = () => (((window as any).engine.metronome.tickCount & 1) < 1 ? 1 : -1);

export default (source: Point, rel: Point, zone: Zone, flag = false): MoveCheckResult => {
	let result: MoveCheckResult;
	let movingLeft: boolean;
	let isFree = false;
	const target = source.byAdding(rel);
	const originalTarget = source.byAdding(rel);
	const alt: Point = new Point(0, 0);
	const evade = EvasionStrategy();

	if (!zone.bounds.contains(target)) {
		return MoveCheckResult.OutOfBounds;
	}

	if (!zone.getTile(target.x, target.y, Zone.Layer.Object)) {
		return MoveCheckResult.Free;
	}

	if (rel.x || !rel.y) {
		if (rel.y) {
			movingLeft = rel.x < 0;
		} else {
			movingLeft = rel.x < 0;
			if (rel.x) {
				if (
					target.y - evade >= 0 &&
					(!zone.getTile(target.x, target.y - evade, Zone.Layer.Object) || flag)
				) {
					target.y -= evade;
					isFree = true;
				}

				if (isFree) {
					return returnAlternativePath();
				}

				alt.y = target.y + evade;
				if (
					zone.size.height <= target.y + evade ||
					(zone.getTile(target.x, target.y + evade, Zone.Layer.Object) && !flag)
				) {
					return ReturnBlockedOrAlternatePath();
				}

				target.y = alt.y;
				isFree = true;
				return ReturnBlockedOrAlternatePath();
			}
		}

		alt.x = target.x + 1;
		if (!movingLeft) {
			alt.x = target.x - 1;
		}

		if (!zone.getTile(alt.x, target.y, Zone.Layer.Object) || flag) {
			target.x = alt.x;
			isFree = true;
		}

		if (isFree) {
			return returnAlternativePath();
		}

		alt.y = target.y + 1;
		if (rel.y >= 0) {
			alt.y = target.y - 1;
		}

		if (zone.getTile(target.x, alt.y, Zone.Layer.Object) && !flag) {
			return ReturnBlockedOrAlternatePath();
		}

		target.y = alt.y;
		isFree = true;
		return ReturnBlockedOrAlternatePath();
	}

	if (target.x - evade >= 0 && (!zone.getTile(target.x - evade, target.y, Zone.Layer.Object) || flag)) {
		target.x -= evade;
		isFree = true;
	} else if (
		zone.size.width > target.x + evade &&
		(!zone.getTile(target.x + evade, target.y, Zone.Layer.Object) || flag)
	) {
		target.x += evade;
		isFree = true;
	}

	return ReturnBlockedOrAlternatePath();

	function ReturnBlockedOrAlternatePath() {
		if (!isFree) return MoveCheckResult.Blocked;
		return returnAlternativePath();
	}

	function returnAlternativePath() {
		if (target.y >= originalTarget.y) {
			if (target.y <= originalTarget.y) {
				if (target.x >= originalTarget.x) {
					result = MoveCheckResult.EvadeRight;
					if (target.x <= originalTarget.x) result = MoveCheckResult.Blocked;
				} else {
					result = MoveCheckResult.EvadeLeft;
				}
			} else {
				result = MoveCheckResult.EvadeDown;
			}
		} else {
			result = MoveCheckResult.EvadeUp;
		}
		return result;
	}
};
