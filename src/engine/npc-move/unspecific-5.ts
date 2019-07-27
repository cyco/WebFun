import { NPC, Zone } from "../objects";
import { Point, randmod } from "src/util";

import {
	evade,
	noMovement,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	moveCheck,
	convertToDirectionPoint,
	MoveCheckResult,
	performMeleeAttack
} from "./helpers";
import { Engine } from "src/engine";

export default (npc: NPC, zone: Zone, engine: Engine) => {
	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}
	if (!randmod(2)) return noMovement(npc, zone, engine);

	let direction: Point;
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(npc.position);

	if (distanceToHero.x >= 2 || distanceToHero.y >= 2) {
		direction = convertToDirectionPoint(npc.preferredDirection);
		if (moveCheck(npc.position, direction, zone, false) !== MoveCheckResult.Free) {
			direction = new Point(0, 0);
			npc.cooldown = randmod(8);
			npc.preferredDirection = randmod(4) - 1;
		}
	} else {
		direction = directionToHero;
		direction = evade(direction, moveCheck(npc.position, direction, zone, false));
	}

	if (canPerformMeleeAttack(direction, npc, hero)) {
		performMeleeAttack(npc, engine);
		return noMovement(npc, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
