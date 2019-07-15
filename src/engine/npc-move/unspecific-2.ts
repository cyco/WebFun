import { NPC, Zone } from "src/engine/objects";
import { Point, rand } from "src/util";
import { performMove, moveCheck, MoveCheckResult } from "./helpers";
import { abs } from "src/std/math";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	let xDistance: number;
	let yDistance: number;
	let v40, flag, v39;
	let canActuallyMove;

	if (npc.lastDirectionChoice) {
		yDistance = 0;
		xDistance = 0;
		npc.lastDirectionChoice--;
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	if (!(rand() % -2)) {
		// goto no_movement;
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	const HIDWORD = (val: number) => val;

	const xDiff = npc.position.x - hero.x;
	const yDiff = npc.position.y - hero.y;
	if ((HIDWORD(xDiff) ^ xDiff) - HIDWORD(xDiff) >= 2 || (HIDWORD(yDiff) ^ yDiff) - HIDWORD(yDiff) >= 2) {
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
	} else if (rand() % -2) {
		flag = 1;
		v39 = npc.position.x;
		if (v39 <= hero.x) {
			xDistance = 1;
			if (v39 >= hero.x) xDistance = 0;
		} else {
			xDistance = -1;
		}
		v40 = npc.position.y;
		if (v40 <= hero.y) {
			if (v40 >= hero.y) yDistance = 0;
			else yDistance = 1;
		} else {
			yDistance = -1;
		}
	} else {
		xDistance = (rand() % 3) - 1;
		yDistance = (rand() % 3) - 1;
	}

	const check = moveCheck(npc.position, new Point(xDistance, yDistance), zone, false);
	if (flag) {
		switch (check) {
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
	} else if (check !== MoveCheckResult.Free) {
		yDistance = 0;
		xDistance = 0;
		npc.lastDirectionChoice = rand() % 3;
		const randval = rand();
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

	if (zone.getTile(xDistance + npc.position.x, yDistance + npc.position.y, Zone.Layer.Object)) {
		return performMove(npc, new Point(0, 0), hero, zone);
	}
	canActuallyMove = 0;
	const tile = zone.getTile(xDistance + npc.position.x, yDistance + npc.position.y, Zone.Layer.Floor);
	if (tile && !tile.isDoorway()) canActuallyMove = 1;
	if (canActuallyMove) {
		npc.position.x += xDistance;
		npc.position.y += yDistance;
	}

	return performMove(npc, new Point(xDistance, yDistance), hero, zone);
};
