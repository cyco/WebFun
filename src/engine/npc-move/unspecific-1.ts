import { NPC, Zone } from "src/engine/objects";
import { Point, rand } from "src/util";
import { performMove, moveCheck, MoveCheckResult } from "./helpers";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	const rel = new Point(0, 0);
	let canActuallyMove: boolean;

	if (npc.lastDirectionChoice) {
		rel.y = 0;
		rel.x = 0;
		npc.lastDirectionChoice--;
		return performMove(npc, rel, hero, zone);
	}

	if (!(rand() % -2)) {
		rel.y = 0;
		rel.x = 0;

		return performMove(npc, rel, hero, zone);
	}

	if (npc.flag1c) {
		if (rand() % -2) {
			rel.x = (rand() % 3) - 1;
			rel.y = (rand() % 3) - 1;
		} else {
			if (npc.position.x <= hero.x) {
				rel.x = -1;
				if (npc.position.x >= hero.x) rel.x = 0;
			} else {
				rel.x = 1;
			}
			if (npc.position.y <= hero.y) {
				if (npc.position.y >= hero.y) rel.y = 0;
				else rel.y = -1;
			} else {
				rel.y = 1;
			}
		}
		npc.currentFrame++;
		if (npc.currentFrame > 3) {
			npc.flag1c = false;
			npc.currentFrame = 0;
		}
	} else {
		if (npc.position.x <= hero.x) {
			rel.x = 1;
			if (npc.position.x >= hero.x) rel.x = 0;
		} else {
			rel.x = -1;
		}
		if (npc.position.y <= hero.y) {
			rel.y = 1;
			if (npc.position.y >= hero.y) rel.y = 0;
		} else {
			rel.y = -1;
		}
	}

	switch (moveCheck(npc.position, new Point(rel.x, rel.y), zone, false)) {
		case MoveCheckResult.OutOfBounds:
		case MoveCheckResult.Blocked:
			rel.y = 0;
			rel.x = 0;
			break;
		case MoveCheckResult.EvadeRight:
			++rel.x;
			break;
		case MoveCheckResult.EvadeLeft:
			--rel.x;
			break;
		case MoveCheckResult.EvadeDown:
			++rel.y;
			break;
		case MoveCheckResult.EvadeUp:
			--rel.y;
			break;
		default:
			break;
	}
	if (rel.x + npc.position.x === hero.x && rel.y + npc.position.y === hero.y) {
		rel.x = 0;
		rel.y = 0;
		if (npc.face.damage >= 0) {
			// TODO: play sound hurt
			// TODO: damage hero
		}
		npc.currentFrame++;
		if (npc.currentFrame > 1) {
			npc.flag1c = true;
			npc.currentFrame = 0;
		}
	}
	if (!zone.getTile(rel.x + npc.position.x, rel.y + npc.position.y, Zone.Layer.Object)) {
		canActuallyMove = false;
		const tile = zone.getTile(rel.x + npc.position.x, rel.y + npc.position.y, Zone.Layer.Floor);
		if (tile && !tile.isDoorway()) {
			canActuallyMove = true;
		}
		if (canActuallyMove) {
			npc.position.x += rel.x;
			npc.position.y += rel.y;
		}
	} else {
		rel.x = 0;
		rel.y = 0;
	}

	if (!npc.flag1c) {
		npc.currentFrame++;
		if (npc.currentFrame >= 15) {
			npc.flag1c = true;
			npc.currentFrame = 0;
		}
	}

	performMove(npc, rel, hero, zone);
};
