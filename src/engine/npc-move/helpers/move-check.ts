import { Zone } from "src/engine/objects";
import MoveCheckResult from "./move-check-result";
import { Point } from "src/util";

export const EvasionStrategy = () => (((window as any).engine.metronome.tickCount & 1) < 1 ? 1 : -1);

export default (source: Point, rel: Point, zone: Zone, flag = false): MoveCheckResult => {
	let result: MoveCheckResult;
	let movingLeft: boolean;
	let isFree = false;
	let targetX = rel.x + source.x;
	let targetY = rel.y + source.y;
	const originalTargetX = rel.x + source.x;
	const originalTargetY = rel.y + source.y;
	let altX: number;
	let altY: number;

	if (targetX < 0 || targetY < 0 || zone.size.width <= targetX || zone.size.height <= targetY)
		return MoveCheckResult.OutOfBounds;

	if (!zone.getTile(targetX, targetY, Zone.Layer.Object)) return MoveCheckResult.Free;

	const evade = EvasionStrategy();

	if (rel.x || !rel.y) {
		if (rel.y) {
			movingLeft = rel.x < 0;
		} else {
			movingLeft = rel.x < 0;
			if (rel.x) {
				if (
					targetY - evade >= 0 &&
					(!zone.getTile(targetX, targetY - evade, Zone.Layer.Object) || flag)
				) {
					targetY -= evade;
					isFree = true;
				}

				if (isFree) {
					return returnAlternativePath();
				}

				altY = targetY + evade;
				if (
					zone.size.height <= targetY + evade ||
					(zone.getTile(targetX, targetY + evade, Zone.Layer.Object) && !flag)
				) {
					return ReturnBlockedOrAlternatePath();
				}

				targetY = altY;
				isFree = true;
				return ReturnBlockedOrAlternatePath();
			}
		}
		altX = targetX + 1;
		if (!movingLeft) {
			altX = targetX - 1;
		}

		if (!zone.getTile(altX, targetY, Zone.Layer.Object) || flag) {
			targetX = altX;
			isFree = true;
		}

		if (isFree) {
			return returnAlternativePath();
		}

		altY = targetY + 1;
		if (rel.y >= 0) {
			altY = targetY - 1;
		}

		if (zone.getTile(targetX, altY, Zone.Layer.Object) && !flag) {
			return ReturnBlockedOrAlternatePath();
		}

		targetY = altY;
		isFree = true;
		return ReturnBlockedOrAlternatePath();
	}

	if (targetX - evade >= 0 && (!zone.getTile(targetX - evade, targetY, Zone.Layer.Object) || flag)) {
		targetX -= evade;
		isFree = true;
	}

	if (!isFree) {
		if (
			zone.size.width > targetX + evade &&
			(!zone.getTile(targetX + evade, targetY, Zone.Layer.Object) || flag)
		) {
			targetX += evade;
			isFree = true;
		}

		if (!isFree) return MoveCheckResult.Blocked;
	}

	return returnAlternativePath();

	function ReturnBlockedOrAlternatePath() {
		if (!isFree) return MoveCheckResult.Blocked;
		return returnAlternativePath();
	}

	function returnAlternativePath() {
		if (targetY >= originalTargetY) {
			if (targetY <= originalTargetY) {
				if (targetX >= originalTargetX) {
					result = MoveCheckResult.EvadeRight;
					if (targetX <= originalTargetX) result = MoveCheckResult.Blocked;
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
