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
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	if (!(rand() % -2)) {
		//goto no_movement;
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	if (abs(npc.position.x - hero.x) >= 2 || abs(npc.position.y - hero.y) >= 2) {
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
		flag = 1;
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
		let randval;

		yDistance = 0;
		xDistance = 0;
		randval = rand();
		npc.lastDirectionChoice = ((randval >> 32) ^ (abs(randval) & 7)) - (randval >> 32);
		randval = rand();
		npc.field30 = ((randval >> 32) ^ (abs(randval) & 3)) - (randval >> 32) - 1;
	}

	if (xDistance + npc.position.x === hero.x && yDistance + npc.position.y === hero.y) {
		xDistance = 0;
		yDistance = 0;
		if (npc.face.damage >= 0) {
			// TODO: play sound hurt
			// TODO: damage hero
		}
	}

	let tile = zone.getTile(xDistance + npc.position.x, yDistance + npc.position.y, Zone.Layer.Object);
	if (tile) {
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	let canActuallyMove = false;
	tile = zone.getTile(xDistance + npc.position.x, yDistance + npc.position.y, Zone.Layer.Floor);
	if (tile && !tile.isDoorway()) canActuallyMove = true;

	if (canActuallyMove) {
		npc.position.x += xDistance;
		npc.position.y += yDistance;
		return performMove(npc, new Point(xDistance, yDistance), hero, zone);
	}

	return performMove(npc, new Point(0, 0), hero, zone);
};
