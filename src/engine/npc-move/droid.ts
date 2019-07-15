import { NPC, Zone } from "src/engine/objects";
import { Point, rand } from "src/util";
import { performMove, moveCheck, MoveCheckResult } from "./helpers";
import { abs } from "src/std/math";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	let xDistance: number;
	let yDistance: number;
	let flag;
	if (npc.lastDirectionChoice) {
		yDistance = 0;
		xDistance = 0;
		npc.lastDirectionChoice--;
	} else {
		const xDiff = abs(npc.position.x - hero.x);
		const yDiff = abs(npc.position.y - hero.y);
		if (xDiff >= 2 || yDiff >= 2) {
			if (rand() % 3) {
				flag = 0;
				switch (npc.field30 + 1) {
					case 0:
						xDistance = 0;
						yDistance = -1;
						break;
					case 1:
						xDistance = 0;
						yDistance = 1;
						break;
					case 2:
						xDistance = 1;
						yDistance = 0;
					case 3:
						xDistance = -1;
						yDistance = 0;
					default:
						break;
				}
			} else {
				xDistance = (rand() % 3) - 1;
				flag = 1;
				yDistance = (rand() % 3) - 1;
			}
		} else {
			flag = 1;
			if (rand() % -2) {
				if (npc.position.x <= hero.x) {
					xDistance = 1;
					if (npc.position.x >= hero.x) xDistance = 0;
				} else {
					xDistance = -1;
				}
				if (npc.position.y <= hero.y) {
					if (npc.position.y >= hero.y) yDistance = 0;
					else yDistance = 1;
				} else {
					yDistance = -1;
				}
			} else {
				xDistance = (rand() % 3) - 1;
				yDistance = (rand() % 3) - 1;
			}
		}

		const checkResult = moveCheck(npc.position, new Point(xDistance, yDistance), zone, false);
		if (flag) {
			switch (checkResult) {
				case MoveCheckResult.OutOfBounds:
				case MoveCheckResult.Blocked:
					yDistance = 0;
					xDistance = 0;
					break;
				case MoveCheckResult.EvadeRight:
					++xDistance;
					break;
				case MoveCheckResult.EvadeLeft:
					--xDistance;
					break;
				case MoveCheckResult.EvadeDown:
					++yDistance;
					break;
				case MoveCheckResult.EvadeUp:
					--yDistance;
					break;
				default:
					break;
			}
		} else if (checkResult !== MoveCheckResult.Free) {
			yDistance = 0;
			xDistance = 0;
			npc.lastDirectionChoice = rand() % 10;
			const randval = rand();
			npc.field30 = ((randval >> 32) ^ (abs(randval) & 3)) - (randval >> 32) - 1;
		}
		if (xDistance + npc.position.x === hero.x && yDistance + npc.position.y === hero.y) {
			xDistance = 0;
			yDistance = 0;
			if (!npc.face.reference && npc.face.damage >= 0 && !(rand() % -2)) {
				// TODO: play sound hurt
				// TODO: damage hero
			}
		}

		if (zone.getTile(xDistance + npc.position.x, yDistance + npc.position.y, Zone.Layer.Object)) {
			return performMove(npc, new Point(0, 0), hero, zone);
		}

		const tile = zone.getTile(xDistance + npc.position.x, yDistance + npc.position.y, Zone.Layer.Floor);
		if (tile && !tile.isDoorway()) {
			npc.position.x += xDistance;
			npc.position.y += yDistance;
		} else {
			return performMove(npc, new Point(0, 0), hero, zone);
		}
	}

	// goto peform_move;
	return performMove(npc, new Point(xDistance, yDistance), hero, zone);
};
