import { Zone } from "src/engine/objects";
import MoveCheckResult from "./move-check-result";
import { Point } from "src/util";

export const EvasionStrategy = () => ((performance.now() & 1) < 1 ? 1 : -1);

export default (source: Point, rel: Point, zone: Zone): MoveCheckResult => {
	const a7 = false;
	const target = source.byAdding(rel);
	if (!zone.bounds.contains(target)) {
		return MoveCheckResult.OutOfBounds;
	}

	if (!zone.getTile(target.x, target.y, Zone.Layer.Object)) {
		return MoveCheckResult.Free;
	}

	const evade = EvasionStrategy();

	let x = target.x;
	let y = target.y;
	let altX: number, altY: number;
	let movingLeft = false;
	let isFree = false;

	if (rel.x || !rel.y) {
		if (rel.y) {
			movingLeft = rel.x < 0;
		} else {
			movingLeft = rel.x < 0;
			if (rel.x) {
				if (y - evade >= 0 && (zone.getTile(x, y - evade, Zone.Layer.Object) === null || a7)) {
					y -= evade;
					isFree = true;
				}
				if (isFree) return returnAlternativePath();
				altY = y + evade;
				if (
					zone.size.height <= y + evade ||
					(zone.getTile(x, y + evade, Zone.Layer.Object) === null && !a7)
				)
					return returnAlternativePath();

				y = altY;
				isFree = true;
				return returnAlternativePath();
			}
		}
		altX = x + 1;
		if (!movingLeft) altX = x - 1;
		if (zone.getTile(altX, y, Zone.Layer.Object) === null || a7) {
			x = altX;
			isFree = true;
		}
		if (isFree) return returnAlternativePath();
		altY = y + 1;
		if (rel.y >= 0) altY = y - 1;
		if (zone.getTile(x, altY, Zone.Layer.Object) === null && !a7) return returnAlternativePath();
		y = altY;
		isFree = true;
		return returnAlternativePath();
	}

	if (x - evade >= 0 && (zone.getTile(x - evade, y, Zone.Layer.Object) === null || a7)) {
		x -= evade;
		isFree = true;
	}

	if (!isFree) {
		if (zone.size.width > x + evade && (zone.getTile(x + evade, y, Zone.Layer.Object) === null || a7)) {
			x += evade;
			isFree = true;
		}
	}

	function returnAlternativePath() {
		if (!isFree) return MoveCheckResult.Blocked;

		if (y >= target.y) {
			if (y <= target.y) {
				if (x >= target.x) {
					return MoveCheckResult.EvadeRight;
					if (x <= target.x) return MoveCheckResult.Blocked; // Blocked
				} else {
					return MoveCheckResult.EvadeLeft;
				}
			} else {
				return MoveCheckResult.EvadeDown;
			}
		} else {
			return MoveCheckResult.EvadeUp;
		}
		return MoveCheckResult.Blocked;
	}

	return returnAlternativePath();
};
