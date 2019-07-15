import { NPC, Zone } from "src/engine/objects";
import { Point, rand } from "src/util";
import { performMove, moveCheck, MoveCheckResult } from "./helpers";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	const rel: Point = new Point(0, 0);

	const HIDWORD = (val: number) => val;

	if (npc.lastDirectionChoice) {
		rel.y = 0;
		rel.x = 0;
		npc.lastDirectionChoice--;
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	if (!(rand() % -2)) {
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	const xDiff = npc.position.x - hero.x;
	const yDiff = npc.position.y - hero.y;
	if (
		(HIDWORD(xDiff) ^ xDiff) - HIDWORD(xDiff) < 2 &&
		(HIDWORD(yDiff) ^ yDiff) - HIDWORD(yDiff) < 2 &&
		rand() % -2
	) {
		if (npc.position.x <= hero.x) {
			rel.x = 1;
			if (npc.position.x >= hero.x) rel.x = 0;
		} else {
			rel.x = -1;
		}
		rel.y = npc.position.y <= hero.y ? (npc.position.y < hero.y ? 1 : 0) : -1;
	} else {
		rel.x = (rand() % 3) - 1;
		rel.y = (rand() % 3) - 1;
	}

	switch (moveCheck(npc.position, rel, zone, false)) {
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
		if (!npc.face.reference && npc.face.damage >= 0) {
			// TODO: play sound hurt
			// TODO: damage hero
		}
	}

	let tile = zone.getTile(rel.x + npc.position.x, rel.y + npc.position.y, Zone.Layer.Object);
	if (tile) {
		return performMove(npc, new Point(0, 0), hero, zone);
	}

	tile = zone.getTile(rel.x + npc.position.x, rel.y + npc.position.y, Zone.Layer.Floor);
	if (tile && !tile.isDoorway()) {
		npc.position.x += rel.x;
		npc.position.y += rel.y;
	}

	return performMove(npc, rel, hero, zone);
};
